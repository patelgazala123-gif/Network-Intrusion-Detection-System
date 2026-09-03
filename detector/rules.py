from collections import defaultdict
import time


# =========================================================
# PACKET TRACKING
# =========================================================

# All packets from each source IP
packet_count = defaultdict(list)

# Different destination ports contacted by each source IP
ip_ports = defaultdict(set)

# ICMP packets from each source IP
icmp_count = defaultdict(list)

# TCP SYN packets from each source IP
syn_count = defaultdict(list)

# UDP packets from each source IP
udp_count = defaultdict(list)

# ARP IP -> MAC mapping
arp_table = {}


# =========================================================
# ALERT STATE
# Prevent repeated alerts for the same ongoing attack
# =========================================================

high_traffic_alerted = set()
port_scan_alerted = set()
icmp_flood_alerted = set()
syn_flood_alerted = set()
udp_flood_alerted = set()
arp_spoof_alerted = set()


def check_rules(data):

    if data is None:
        return None

    source_ip = data.get("source_ip")
    destination_port = data.get("destination_port")
    protocol = data.get("protocol")

    current_time = time.time()


    # =====================================================
    # RULE 1: HIGH TRAFFIC
    # =====================================================

    packet_count[source_ip].append(current_time)

    # Keep only packets from the last 10 seconds
    packet_count[source_ip] = [
        t for t in packet_count[source_ip]
        if current_time - t <= 10
    ]

    # More than 100 packets in 10 seconds
    if len(packet_count[source_ip]) > 100:

        if source_ip not in high_traffic_alerted:

            high_traffic_alerted.add(source_ip)

            return {
                "attack_type": "High Traffic",
                "source_ip": source_ip,
                "severity": "High"
            }

    else:
        high_traffic_alerted.discard(source_ip)


    # =====================================================
    # RULE 2: POSSIBLE PORT SCAN
    # =====================================================

    if destination_port is not None:

        ip_ports[source_ip].add(destination_port)

        # More than 20 different ports
        if len(ip_ports[source_ip]) > 20:

            if source_ip not in port_scan_alerted:

                port_scan_alerted.add(source_ip)

                return {
                    "attack_type": "Possible Port Scan",
                    "source_ip": source_ip,
                    "severity": "High"
                }


    # =====================================================
    # RULE 3: ICMP FLOOD
    # =====================================================

    if protocol == "ICMP":

        icmp_count[source_ip].append(current_time)

        # Keep only ICMP packets from last 10 seconds
        icmp_count[source_ip] = [
            t for t in icmp_count[source_ip]
            if current_time - t <= 10
        ]

        
        # More than 5 ICMP packets in 10 seconds
        if len(icmp_count[source_ip]) > 50:

            if source_ip not in icmp_flood_alerted:

                icmp_flood_alerted.add(source_ip)

                return {
                    "attack_type": "ICMP Flood",
                    "source_ip": source_ip,
                    "severity": "High"
                }

        else:
            icmp_flood_alerted.discard(source_ip)


    # =====================================================
    # RULE 4: SYN FLOOD
    # =====================================================

    if protocol == "TCP" and data.get("tcp_syn"):

        syn_count[source_ip].append(current_time)

        # Keep only SYN packets from last 10 seconds
        syn_count[source_ip] = [
            t for t in syn_count[source_ip]
            if current_time - t <= 10
        ]

        # More than 50 SYN packets in 10 seconds
        if len(syn_count[source_ip]) > 50:

            if source_ip not in syn_flood_alerted:

                syn_flood_alerted.add(source_ip)

                return {
                    "attack_type": "SYN Flood",
                    "source_ip": source_ip,
                    "severity": "High"
                }

        else:
            syn_flood_alerted.discard(source_ip)


    # =====================================================
    # RULE 5: UDP FLOOD
    # =====================================================

    if protocol == "UDP":

        udp_count[source_ip].append(current_time)

        # Keep only UDP packets from last 10 seconds
        udp_count[source_ip] = [
            t for t in udp_count[source_ip]
            if current_time - t <= 10
        ]

        # More than 50 UDP packets in 10 seconds
        if len(udp_count[source_ip]) > 50:

            if source_ip not in udp_flood_alerted:

                udp_flood_alerted.add(source_ip)

                return {
                    "attack_type": "UDP Flood",
                    "source_ip": source_ip,
                    "severity": "High"
                }

        else:
            udp_flood_alerted.discard(source_ip)


    # =====================================================
    # RULE 6: ARP SPOOFING
    # =====================================================

    arp_ip = data.get("arp_ip")
    arp_mac = data.get("arp_mac")

    if arp_ip is not None and arp_mac is not None:

        # First time seeing this IP
        if arp_ip not in arp_table:

            arp_table[arp_ip] = arp_mac

        # Same IP appears with a different MAC
        elif arp_table[arp_ip] != arp_mac:

            if arp_ip not in arp_spoof_alerted:

                arp_spoof_alerted.add(arp_ip)

                # Update mapping
                arp_table[arp_ip] = arp_mac

                return {
                    "attack_type": "ARP Spoofing",
                    "source_ip": source_ip,
                    "severity": "Critical"
                }


    # =====================================================
    # NO THREAT
    # =====================================================

    return None
