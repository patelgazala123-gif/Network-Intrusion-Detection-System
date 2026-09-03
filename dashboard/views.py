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