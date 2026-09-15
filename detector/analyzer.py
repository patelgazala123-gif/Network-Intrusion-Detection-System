from django.utils import timezone
from scapy.all import IP, TCP, UDP, ICMP, ARP


def analyze_packet(packet):

    # =====================================================
    # ARP PACKET
    # =====================================================

    if ARP in packet:

        data = {
            "timestamp": timezone.now(),
            "source_ip": packet[ARP].psrc,
            "destination_ip": packet[ARP].pdst,
            "protocol": "ARP",
            "source_port": None,
            "destination_port": None,
            "packet_length": len(packet),

            # TCP
            "tcp_syn": False,

            # ARP information
            "arp_ip": packet[ARP].psrc,
            "arp_mac": packet[ARP].hwsrc
        }

        return data


    # =====================================================
    # IP PACKET
    # =====================================================

    if IP not in packet:
        return None


    data = {
        "timestamp": timezone.now(),
        "source_ip": packet[IP].src,
        "destination_ip": packet[IP].dst,
        "protocol": packet[IP].proto,
        "source_port": None,
        "destination_port": None,
        "packet_length": len(packet),

        # TCP SYN information
        "tcp_syn": False,

        # ARP fields
        "arp_ip": None,
        "arp_mac": None
    }


    # =====================================================
    # TCP
    # =====================================================

    if TCP in packet:
        
        data["protocol"] = "TCP"

        data["source_port"] = packet[TCP].sport
        data["destination_port"] = packet[TCP].dport
        print("TCP FLAGS:", packet[TCP].flags)
        # SYN flag
        data["tcp_syn"] = str(packet[TCP].flags) == "S"


    # =====================================================
    # UDP
    # =====================================================

    elif UDP in packet:

        data["protocol"] = "UDP"

        data["source_port"] = packet[UDP].sport
        data["destination_port"] = packet[UDP].dport


    # =====================================================
    # ICMP
    # =====================================================

    elif ICMP in packet:

        data["protocol"] = "ICMP"


    # =====================================================
    # OTHER IP PROTOCOL
    # =====================================================

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

    # Show SYN information for TCP
    if data["protocol"] == "TCP":
        print("TCP SYN          :", data["tcp_syn"])

    # Show ARP information
    if data["protocol"] == "ARP":
        print("ARP IP           :", data["arp_ip"])
        print("ARP MAC          :", data["arp_mac"])

    print("=====================================")