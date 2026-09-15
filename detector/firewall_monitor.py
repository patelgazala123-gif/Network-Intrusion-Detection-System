import os
import sys
import subprocess
import socket
import time

# Add project root to Python path
PROJECT_ROOT = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

sys.path.insert(0, PROJECT_ROOT)

# Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "nids.settings")

import django
django.setup()

from django.utils import timezone
from dashboard.models import Alert


def get_local_ip():
    try:
        hostname = socket.gethostname()
        return socket.gethostbyname(hostname)
    except Exception:
        return "127.0.0.1"


def is_firewall_disabled():
    try:
        result = subprocess.run(
            [
                r"C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe",
                "-Command",
                "(Get-NetFirewallProfile -Name Private).Enabled"
            ],
            capture_output=True,
            text=True,
            timeout=5
        )

        status = result.stdout.strip().lower()

        if status == "false":
            print("Firewall Status : OFF")
            return True
        else:
            print("Firewall Status : ON")
            return False

    except Exception as e:
        print("Firewall check error:", e)
        return False


def monitor_firewall():

    firewall_alerted = False

    while True:

        disabled = is_firewall_disabled()

        if disabled and not firewall_alerted:

            Alert.objects.create(
                timestamp=timezone.now(),
                attack_type="Firewall Disabled",
                source_ip=get_local_ip(),
                severity="Critical",
                status="Detected"
            )

            print("🚨 FIREWALL DISABLED - CRITICAL ALERT")

            firewall_alerted = True

        elif not disabled:

            firewall_alerted = False

        time.sleep(5)