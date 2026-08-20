from scapy.all import sniff, IP
from analyzer import analyze_packet, display_packet
from rules import check_rules


def process_packet(packet):
    if IP in packet:

        # Step 1: Analyze packet
        data = analyze_packet(packet)

        # Step 2: Display packet information
        display_packet(data)

        # Step 3: Check security rules
        threat = check_rules(data)

        # Step 4: Display result
        if threat:
            print("\n🚨 THREAT DETECTED 🚨")
            print("Attack Type :", threat["attack_type"])
            print("Source IP   :", threat["source_ip"])
            print("Severity    :", threat["severity"])
            print("------------------------------")

        else:
            print("Status       : NORMAL")
            print("------------------------------")


def start_capture():
    print("===================================")
    print("       NIDS PACKET MONITOR")
    print("===================================")
    print("Capturing and analyzing packets...")
    print("Press Ctrl+C to stop.\n")

    sniff(
        prn=process_packet,
        store=False
    )


if __name__ == "__main__":
    start_capture()