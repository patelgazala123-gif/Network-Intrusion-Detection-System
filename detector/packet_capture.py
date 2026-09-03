from scapy.all import sniff, IP, ARP

from analyzer import analyze_packet, display_packet
from rules import check_rules
from alerts import create_alert, display_alert
from logger import save_packet, save_alert


def process_packet(packet):

    # Accept both IP and ARP packets
    if IP in packet or ARP in packet:

        # Step 1: Analyze packet
        data = analyze_packet(packet)

        if data is None:
            return

        # Step 2: Display packet
        display_packet(data)

        # Step 3: Save packet information
        save_packet(data)

        # Step 4: Check security rules
        threat = check_rules(data)

        # Step 5: Handle detected threat
        if threat:

            alert = create_alert(threat)

            # Display alert
            display_alert(alert)

            # Save alert
            save_alert(alert)

        else:
            print("Status       : NORMAL")
            print("------------------------------")


def start_capture():

    print("===================================")
    print("       NIDS PACKET MONITOR")
    print("===================================")
    print("Capturing, analyzing and logging...")
    print("Press Ctrl+C to stop.\n")

    sniff(
        prn=process_packet,
        store=False
    )


if __name__ == "__main__":
    start_capture()