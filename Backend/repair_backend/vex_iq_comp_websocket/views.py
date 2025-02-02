from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, "vex_iq_comp_webscoket/index.html")

def room(request):
    return render(request, "vex_iq_comp_webscoket/room.html")

def user(request):
    return render(request, "vex_iq_comp_webscoket/user.html")


def admin(request):
    return render(request, "vex_iq_comp_webscoket/admin_index.html")

def user_news(request):
    return render(request, "vex_iq_comp_webscoket/user_index.html")

def user_notification(request):
    return render(request, "vex_iq_comp_webscoket/user_notification_index.html")