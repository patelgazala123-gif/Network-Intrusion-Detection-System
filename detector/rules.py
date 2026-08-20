from collections import defaultdict
import time


# Store packet count for each source IP
packet_count = defaultdict(list)

# Store ports contacted by each source IP
ip_ports = defaultdict(set)


def check_rules(data):
    if data is None:
        return None

    source_ip = data["source_ip"]
    destination_port = data["destination_port"]
    current_time = time.time()

    # -------------------------------
    # RULE 1: High Traffic
    # -------------------------------

    packet_count[source_ip].append(current_time)

    # Keep only packets from the last 10 seconds
    packet_count[source_ip] = [
        t for t in packet_count[source_ip]
        if current_time - t <= 10
    ]

    if len(packet_count[source_ip]) > 100:
        return {
            "attack_type": "High Traffic",
            "source_ip": source_ip,
            "severity": "High"
        }

    # -------------------------------
    # RULE 2: Possible Port Scan
    # -------------------------------

    if destination_port is not None:
        ip_ports[source_ip].add(destination_port)

        if len(ip_ports[source_ip]) > 20:
            return {
                "attack_type": "Possible Port Scan",
                "source_ip": source_ip,
                "severity": "High"
            }

    # -------------------------------
    # NORMAL TRAFFIC
    # -------------------------------

    return None