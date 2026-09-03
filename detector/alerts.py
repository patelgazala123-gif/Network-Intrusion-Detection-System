from datetime import datetime


def create_alert(threat):
    if threat is None:
        return None

    alert = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "attack_type": threat["attack_type"],
        "source_ip": threat["source_ip"],
        "severity": threat["severity"],
        "status": "Detected"
    }

    return alert


def display_alert(alert):
    if alert is None:
        return

    print("\n========== SECURITY ALERT ==========")
    print("Time       :", alert["timestamp"])
    print("Attack     :", alert["attack_type"])
    print("Source IP  :", alert["source_ip"])
    print("Severity   :", alert["severity"])
    print("Status     :", alert["status"])
    print("====================================")