from django.urls import path
from . import views

urlpatterns = [
    path("", views.dashboard, name="dashboard"),
    path("live-monitoring/", views.live_monitoring, name="live_monitoring"),
    path("packet-logs/", views.packet_logs, name="packet_logs"),
    path('threat-detection/', views.threat_detection, name='threat_detection'),
    path('alerts/', views.alerts, name='alerts'),
    path('reports/', views.reports, name='reports'),
    path('settings/', views.settings, name='settings'),
]