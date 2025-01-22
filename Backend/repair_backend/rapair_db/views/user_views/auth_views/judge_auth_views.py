from rest_framework.views import APIView
from rest_framework.response import Response
from ....serializers.user_serializers.user_data_serializers import UserSerializer 
from rest_framework import status
from ....permissions import IsSuperUser


class JudgeRegisterView(APIView):
    permission_classes = [IsSuperUser]
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(f"message': 'User registered successfully User :{serializer.data} ", status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

