from django.db import models

class PacketLog(models.Model):
    timestamp = models.DateTimeField()
    source_ip = models.GenericIPAddressField()
    destination_ip = models.GenericIPAddressField()
    protocol = models.CharField(max_length=20)
    source_port = models.IntegerField(null=True, blank=True)
    destination_port = models.IntegerField(null=True, blank=True)
    packet_length = models.IntegerField()

    def __str__(self):
        return f"{self.source_ip} -> {self.destination_ip}"


class Alert(models.Model):
    timestamp = models.DateTimeField()
    attack_type = models.CharField(max_length=100)
    source_ip = models.GenericIPAddressField()
    severity = models.CharField(max_length=20)
    status = models.CharField(max_length=30, default="Detected")

    def __str__(self):
        return f"{self.attack_type} - {self.source_ip}"