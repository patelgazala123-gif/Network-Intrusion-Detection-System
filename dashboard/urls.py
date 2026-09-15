from django.urls import path
from . import views

urlpatterns = [
    path("", views.dashboard, name="dashboard"),
    path("dashboard-data/", views.dashboard_data, name="dashboard_data"),

    path("live-monitoring/", views.live_monitoring, name="live_monitoring"),
    path("live-monitoring-data/", views.live_monitoring_data, name="live_monitoring_data"),

    path("packet-logs/", views.packet_logs, name="packet_logs"),
    path("packet-logs-data/", views.packet_logs_data, name="packet_logs_data"),

    path("threat-detection/", views.threat_detection, name="threat_detection"),
    path("threat-detection-data/", views.threat_detection_data, name="threat_detection_data"),

    path("alerts/", views.alerts, name="alerts"),

    path("reports/", views.reports, name="reports"),
    path("reports-data/", views.reports_data, name="reports_data"),

    path("settings/", views.settings, name="settings"),
    path("clear-packet-logs/", views.clear_packet_logs, name="clear_packet_logs"),
    path("clear-alerts/", views.clear_alerts, name="clear_alerts"),
]