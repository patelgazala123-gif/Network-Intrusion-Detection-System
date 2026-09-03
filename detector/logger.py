import os
import sys
import django

# Find the main NIDS project folder
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

# Load Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "nids.settings")
django.setup()

from dashboard.models import PacketLog, Alert


def save_packet(data):
    if data is None:
        return

    PacketLog.objects.create(
        timestamp=data.get("timestamp"),
        source_ip=data.get("source_ip"),
        destination_ip=data.get("destination_ip"),
        protocol=data.get("protocol"),
        source_port=data.get("source_port"),
        destination_port=data.get("destination_port"),
        packet_length=data.get("packet_length")
    )


def save_alert(alert):
    if alert is None:
        return

    Alert.objects.create(
        timestamp=alert.get("timestamp"),
        attack_type=alert.get("attack_type"),
        source_ip=alert.get("source_ip"),
        severity=alert.get("severity"),
        status=alert.get("status", "Detected")
    )