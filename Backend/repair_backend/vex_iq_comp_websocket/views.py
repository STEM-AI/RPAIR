from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, "vex_iq_comp_webscoket/index.html")

def room(request, room_name):
    return render(request, "vex_iq_comp_webscoket/room.html", {"room_name": room_name})