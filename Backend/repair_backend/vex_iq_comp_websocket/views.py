from django.shortcuts import render

# Create your views here.
def event_live_dashboard(request):
    return render(request, "vex_iq_comp_webscoket/event_live_dashboard.html")

def game_control(request):
    return render(request, "vex_iq_comp_webscoket/game_control.html")

def user_game(request):
    return render(request, "vex_iq_comp_webscoket/user_game.html")


def admin_send_news(request):
    return render(request, "vex_iq_comp_webscoket/admin_send_news.html")

def user_news(request):
    return render(request, "vex_iq_comp_webscoket/user_news.html")

def user_notification(request):
    return render(request, "vex_iq_comp_webscoket/user_notification_index.html")

def live_dashboard(request):
    return render(request, "vex_iq_comp_webscoket/live_dashboard.html")