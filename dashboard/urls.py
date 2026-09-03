from django.urls import path
from . import views

urlpatterns = [
    path("", views.dashboard, name="dashboard"),
    path("dashboard-data/", views.dashboard_data, name="dashboard_data"),

    path("live-monitoring/", views.live_monitoring, name="live_monitoring"),

    path("packet-logs/", views.packet_logs, name="packet_logs"),
    path("packet-logs-data/", views.packet_logs_data, name="packet_logs_data"),

    path("threat-detection/", views.threat_detection, name="threat_detection"),
   
    path("alerts/", views.alerts, name="alerts"),
    
    path("reports/", views.reports, name="reports"),
   
    path("settings/", views.settings, name="settings"),
]