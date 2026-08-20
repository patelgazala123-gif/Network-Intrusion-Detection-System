from django.shortcuts import render


def dashboard(request):
    return render(request, 'dashboard.html')


def live_monitoring(request):
    return render(request, 'live_monitoring.html')


def packet_logs(request):
    return render(request, 'packet_logs.html')


def threat_detection(request):
    return render(request, 'threat_detection.html')


def alerts(request):
    return render(request, 'alerts.html')


def reports(request):
    return render(request, 'reports.html')

def settings (request):
    return render(request, 'settings.html')