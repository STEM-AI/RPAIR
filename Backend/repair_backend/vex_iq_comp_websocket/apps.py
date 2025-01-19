from django.apps import AppConfig


class VexIqCompWebsocketConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'vex_iq_comp_websocket'

    def ready(self):
        import vex_iq_comp_websocket.signals
