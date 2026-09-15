from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Count
from django.db.models.functions import TruncSecond
from django.utils import timezone
from datetime import timedelta
import psutil
import os
from django.utils import timezone

from .models import PacketLog, Alert


def dashboard(request):
    return render(request, "dashboard.html")


def dashboard_data(request):

    # ==========================================
    # BASIC COUNTS
    # ==========================================

    total_packets = PacketLog.objects.count()
    total_alerts = Alert.objects.count()

    # For dashboard display
    safe_packets = max(total_packets - total_alerts, 0)

    blocked_ips = (
        Alert.objects
        .filter(status__iexact="Blocked")
        .values("source_ip")
        .distinct()
        .count()
    )

    # ==========================================
    # ALERT COUNTS
    # ==========================================

    critical_count = Alert.objects.filter(
        severity__iexact="Critical"
    ).count()

    high_count = Alert.objects.filter(
        severity__iexact="High"
    ).count()

    medium_count = Alert.objects.filter(
        severity__iexact="Medium"
    ).count()

    low_count = Alert.objects.filter(
        severity__iexact="Low"
    ).count()

    # ==========================================
    # RECENT ALERTS
    # ==========================================

    recent_alerts = (
        Alert.objects
        .order_by("-timestamp")[:4]
    )

    alerts_data = []

    for alert in recent_alerts:

        alerts_data.append({
            "time": timezone.localtime(
                alert.timestamp
            ).strftime("%I:%M:%S %p"),

            "attack_type": alert.attack_type,

            "source_ip": alert.source_ip,

            "severity": alert.severity,

            "status": alert.status
        })

    # ==========================================
    # REAL-TIME TRAFFIC
    # LAST 30 SECONDS
    # ==========================================

    now = timezone.now()

    start_time = now - timedelta(seconds=30)

    traffic_queryset = (
        PacketLog.objects
        .filter(timestamp__gte=start_time)
        .annotate(
            second=TruncSecond("timestamp")
        )
        .values("second")
        .annotate(
            count=Count("id")
        )
        .order_by("second")
    )

    traffic_labels = []
    traffic_values = []

    for item in traffic_queryset:

        second = item["second"]

        if second:

            traffic_labels.append(
                timezone.localtime(
                    second
                ).strftime("%H:%M:%S")
            )

            traffic_values.append(
                item["count"]
            )

    # ==========================================
    # LAST 24 HOURS
    # ==========================================

    start_24 = now - timedelta(hours=24)

    traffic_24_queryset = (
        PacketLog.objects
        .filter(timestamp__gte=start_24)
        .values("timestamp__hour")
        .annotate(
            count=Count("id")
        )
        .order_by("timestamp__hour")
    )

    traffic_24 = [0] * 24

    for item in traffic_24_queryset:

        hour = item["timestamp__hour"]

        if hour is not None:

            traffic_24[hour] = item["count"]

    traffic_24_labels = [
        f"{hour:02d}:00"
        for hour in range(24)
    ]

    # ==========================================
    # LAST 7 DAYS
    # ==========================================

    start_7 = now - timedelta(days=6)

    daily_queryset = (
        PacketLog.objects
        .filter(timestamp__gte=start_7)
        .values("timestamp__date")
        .annotate(
            count=Count("id")
        )
        .order_by("timestamp__date")
    )

    daily_counts = {}

    for item in daily_queryset:

        date_value = item["timestamp__date"]

        daily_counts[str(date_value)] = item["count"]

    traffic_7 = []
    traffic_7_labels = []

    for i in range(6, -1, -1):

        day = (
            now -
            timedelta(days=i)
        ).date()

        day_string = str(day)

        traffic_7_labels.append(
            day.strftime("%d %b")
        )

        traffic_7.append(
            daily_counts.get(
                day_string,
                0
            )
        )

    # ==========================================
    # SYSTEM STATUS
    # ==========================================

    cpu_usage = psutil.cpu_percent(
        interval=None
    )

    ram_usage = psutil.virtual_memory().percent

    storage_usage = psutil.disk_usage(
        os.path.abspath(os.sep)
    ).percent

    # Simple network activity indicator
    network = psutil.net_io_counters()

    total_network_mb = (
        network.bytes_sent +
        network.bytes_recv
    ) / (1024 * 1024)

    network_load = int(
        total_network_mb % 100
    )

    # ==========================================
    # RESPONSE
    # ==========================================

    response = JsonResponse({

        "total_packets":
            total_packets,

        "total_alerts":
            total_alerts,

        "safe_connections":
            safe_packets,

        "blocked_ips":
            blocked_ips,

        "critical_count":
            critical_count,

        "high_count":
            high_count,

        "medium_count":
            medium_count,

        "low_count":
            low_count,

        "recent_alerts":
            alerts_data,

        # Real-time graph
        "traffic_labels":
            traffic_labels,

        "traffic":
            traffic_values,

        # 24 hours
        "traffic_24_labels":
            traffic_24_labels,

        "traffic_24":
            traffic_24,

        # 7 days
        "traffic_7_labels":
            traffic_7_labels,

        "traffic_7":
            traffic_7,

        # System
        "system": {

            "cpu":
                round(cpu_usage),

            "ram":
                round(ram_usage),

            "storage":
                round(storage_usage),

            "network":
                network_load
        }
    })

    # ==========================================
    # PREVENT CACHING
    # ==========================================

    response["Cache-Control"] = (
        "no-cache, no-store, "
        "must-revalidate"
    )

    response["Pragma"] = "no-cache"

    response["Expires"] = "0"

    return response


def live_monitoring(request):
    return render(
        request,
        "live_monitoring.html"
    )
def live_monitoring_data(request):

    now = timezone.now()

    # ==========================================
    # PACKETS PER SECOND
    # Only packets captured in last 1 second
    # ==========================================

    one_second_ago = now - timedelta(seconds=1)

    packets_per_second = PacketLog.objects.filter(
        timestamp__gte=one_second_ago
    ).count()


    # ==========================================
    # RECENT PACKETS
    # Last 5 seconds
    # ==========================================

    five_seconds_ago = now - timedelta(seconds=5)

    recent_packets = PacketLog.objects.filter(
        timestamp__gte=five_seconds_ago
    )


    # ==========================================
    # ACTIVE CONNECTIONS
    # ==========================================

    connections = recent_packets.values(
        "source_ip",
        "destination_ip"
    ).distinct().count()


    # ==========================================
    # RECENT THREATS
    # Last 5 seconds
    # ==========================================

    threats_detected = Alert.objects.filter(
        timestamp__gte=five_seconds_ago
    ).count()


    # ==========================================
    # LOCAL IP ADDRESSES
    # ==========================================

    local_ips = set()

    for addresses in psutil.net_if_addrs().values():

        for address in addresses:

            if address.family.name == "AF_INET":
                local_ips.add(address.address)


    # ==========================================
    # INCOMING / OUTGOING PACKETS
    # ==========================================

    incoming = 0
    outgoing = 0

    for packet in recent_packets:

        if packet.destination_ip in local_ips:
            incoming += 1

        if packet.source_ip in local_ips:
            outgoing += 1


    # ==========================================
    # LIVE TRAFFIC
    # Last 20 seconds
    # ==========================================

    traffic = []
    labels = []

    for i in range(19, -1, -1):

        start = now - timedelta(seconds=i + 1)

        end = now - timedelta(seconds=i)

        count = PacketLog.objects.filter(
            timestamp__gte=start,
            timestamp__lt=end
        ).count()

        traffic.append(count)

        labels.append(
            timezone.localtime(
                end
            ).strftime("%H:%M:%S")
        )


    # ==========================================
    # LIVE PACKET FEED
    # Only packets from last 5 seconds
    # ==========================================

    packets = recent_packets.order_by(
        "-timestamp"
    )[:10]


    # Recent threat IPs

    recent_alert_ips = set(
        Alert.objects.filter(
            timestamp__gte=five_seconds_ago
        ).values_list(
            "source_ip",
            flat=True
        )
    )


    packet_data = []


    for packet in packets:

        if packet.source_ip in recent_alert_ips:

            status = "Threat"

            status_class = "threat"

        else:

            status = "Safe"

            status_class = "safe"


        packet_data.append({

            "time":
                timezone.localtime(
                    packet.timestamp
                ).strftime("%H:%M:%S"),

            "source_ip":
                packet.source_ip,

            "protocol":
                packet.protocol,

            "port":
                packet.destination_port
                if packet.destination_port is not None
                else "-",

            "status":
                status,

            "status_class":
                status_class
        })


    # ==========================================
    # RESPONSE
    # ==========================================

    response = JsonResponse({

        "packets_per_second":
            packets_per_second,

        "active_connections":
            connections,

        "threats_detected":
            threats_detected,

        "incoming":
            incoming,

        "outgoing":
            outgoing,

        "traffic":
            traffic,

        "labels":
            labels,

        "packets":
            packet_data
    })


    # ==========================================
    # PREVENT CACHING
    # ==========================================

    response["Cache-Control"] = (
        "no-cache, no-store, "
        "must-revalidate"
    )

    response["Pragma"] = "no-cache"

    response["Expires"] = "0"


    return response

def packet_logs(request):

    packets = (
        PacketLog.objects
        .order_by("-timestamp")[:10]
    )

    total_packets = PacketLog.objects.count()

    return render(
        request,
        "packet_logs.html",
        {
            "packets": packets,
            "total_packets": total_packets
        }
    )


def threat_detection(request):
    return render(
        request,
        "threat_detection.html"
    )


def alerts(request):

    alerts = (
        Alert.objects
        .order_by("-timestamp")[:10]
    )

    timeline_alerts = (
        Alert.objects
        .order_by("-timestamp")[:3]
    )

    total_alerts = Alert.objects.count()

    critical_count = Alert.objects.filter(
        severity__iexact="Critical"
    ).count()

    high_count = Alert.objects.filter(
        severity__iexact="High"
    ).count()

    medium_count = Alert.objects.filter(
        severity__iexact="Medium"
    ).count()

    low_count = Alert.objects.filter(
        severity__iexact="Low"
    ).count()

    return render(
        request,
        "alerts.html",
        {
            "alerts": alerts,
            "timeline_alerts":
                timeline_alerts,

            "total_alerts":
                total_alerts,

            "critical_count":
                critical_count,

            "high_count":
                high_count,

            "medium_count":
                medium_count,

            "low_count":
                low_count,
        }
    )


def reports(request):
    return render(
        request,
        "reports.html"
    )


def settings(request):
    return render(
        request,
        "settings.html"
    )
def packet_logs_data(request):

    packets = PacketLog.objects.order_by("-timestamp")[:10]

    packet_data = []

    for packet in packets:
        packet_data.append({
            "id": packet.id,
            "time": timezone.localtime(
                packet.timestamp
            ).strftime("%H:%M:%S"),

            "source_ip": packet.source_ip,
            "destination_ip": packet.destination_ip,
            "protocol": packet.protocol,

            "source_port":
                packet.source_port
                if packet.source_port is not None
                else "-",

            "destination_port":
                packet.destination_port
                if packet.destination_port is not None
                else "-",

            "packet_length": packet.packet_length,

            "status": "Normal"
        })

    total_packets = PacketLog.objects.count()
    total_alerts = Alert.objects.count()

    threat_packets = min(
        total_alerts,
        total_packets
    )

    safe_packets = max(
        total_packets - threat_packets,
        0
    )

    return JsonResponse({
        "total_packets": total_packets,

        "safe_count": safe_packets,

        "suspicious_count": 0,

        "threat_count": threat_packets,

        "packets": packet_data
    })
from django.http import JsonResponse
from .models import PacketLog, Alert


def clear_packet_logs(request):
    if request.method == "POST":
        PacketLog.objects.all().delete()
        return JsonResponse({
            "success": True,
            "message": "Packet logs cleared successfully."
        })

    return JsonResponse({
        "success": False
    }, status=405)


def clear_alerts(request):
    if request.method == "POST":
        Alert.objects.all().delete()
        return JsonResponse({
            "success": True,
            "message": "Alert history cleared successfully."
        })

    return JsonResponse({
        "success": False
    }, status=405)
def threat_detection_data(request):

    last_24_hours = timezone.now() - timedelta(hours=24)

    alerts = Alert.objects.filter(
        timestamp__gte=last_24_hours
    )

    total_alerts = alerts.count()

    threat_categories = (
        alerts.values("attack_type")
        .distinct()
        .count()
    )

    high_risk_events = alerts.filter(
        severity__in=["High", "Critical"]
    ).count()

    attack_counts = (
        alerts.values("attack_type")
        .annotate(count=Count("id"))
        .order_by("-count")
    )

    attack_labels = []
    attack_values = []
    attacks = []

    for item in attack_counts:

        attack_type = item["attack_type"]
        count = item["count"]

        attack_labels.append(attack_type)
        attack_values.append(count)

        attacks.append({
            "type": attack_type,
            "count": count
        })

    critical_count = alerts.filter(
        severity="Critical"
    ).count()

    high_count = alerts.filter(
        severity="High"
    ).count()

    medium_count = alerts.filter(
        severity="Medium"
    ).count()

    risk_score = (
        critical_count * 20 +
        high_count * 10 +
        medium_count * 5
    )

    risk_score = min(risk_score, 100)

    return JsonResponse({
        "total_alerts": total_alerts,
        "threat_categories": threat_categories,
        "high_risk_events": high_risk_events,
        "risk_score": risk_score,
        "attack_labels": attack_labels,
        "attack_values": attack_values,
        "attacks": attacks
    })
def reports_data(request):

    period = request.GET.get("period", "7")

    if period == "30":
        days = 30
    elif period == "90":
        days = 90
    else:
        days = 7

    start_date = timezone.now() - timedelta(days=days)

    # Packet data
    packets = PacketLog.objects.filter(
        timestamp__gte=start_date
    )

    # Alert data
    alerts = Alert.objects.filter(
        timestamp__gte=start_date
    )

    # -----------------------------
    # TRAFFIC TREND
    # -----------------------------

    traffic_labels = []
    traffic_values = []

    for i in range(days):

        day = start_date + timedelta(days=i)

        next_day = day + timedelta(days=1)

        count = packets.filter(
            timestamp__gte=day,
            timestamp__lt=next_day
        ).count()

        traffic_labels.append(day.strftime("%d %b"))
        traffic_values.append(count)

    # -----------------------------
    # THREAT SUMMARY
    # -----------------------------

    detected = alerts.count()

    resolved = alerts.filter(
        status="Resolved"
    ).count()

    # -----------------------------
    # SECURITY SCORE
    # -----------------------------

    critical = alerts.filter(
        severity="Critical"
    ).count()

    high = alerts.filter(
        severity="High"
    ).count()

    medium = alerts.filter(
        severity="Medium"
    ).count()

    risk = (
        critical * 20 +
        high * 10 +
        medium * 5
    )

    security_score = max(0, 100 - min(risk, 100))

    if security_score >= 80:
        score_status = "Good Network Security"
    elif security_score >= 60:
        score_status = "Moderate Network Security"
    else:
        score_status = "High Security Risk"

    return JsonResponse({
        "traffic_labels": traffic_labels,
        "traffic_values": traffic_values,

        "detected": detected,
        "resolved": resolved,

        "security_score": security_score,
        "score_status": score_status
    })