from datetime import datetime
from scapy.all import IP, TCP, UDP


def analyze_packet(packet):
    # Make sure packet contains an IP layer
    if IP not in packet:
        return None

    data = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "source_ip": packet[IP].src,
        "destination_ip": packet[IP].dst,
        "protocol": packet[IP].proto,
        "source_port": None,
        "destination_port": None,
        "packet_length": len(packet)
    }

    # TCP packet
    if TCP in packet:
        data["protocol"] = "TCP"
        data["source_port"] = packet[TCP].sport
        data["destination_port"] = packet[TCP].dport

    # UDP packet
    elif UDP in packet:
        data["protocol"] = "UDP"
        data["source_port"] = packet[UDP].sport
        data["destination_port"] = packet[UDP].dport

    # Other IP protocols
    else:
        data["protocol"] = str(packet[IP].proto)

    return data


def display_packet(data):
    if data is None:
        return

    print("\n========== ANALYZED PACKET ==========")
    print("Time             :", data["timestamp"])
    print("Source IP        :", data["source_ip"])
    print("Destination IP   :", data["destination_ip"])
    print("Protocol         :", data["protocol"])
    print("Source Port      :", data["source_port"])
    print("Destination Port :", data["destination_port"])
    print("Packet Length    :", data["packet_length"])
    print("=====================================")