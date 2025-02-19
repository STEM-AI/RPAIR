from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated ,AllowAny
from rest_framework import status
from ...serializers.user_serializers.user_data_serializers import UserSerializer , UserEditProfileSerializer , JudgeListSerializer
from rest_framework.generics import RetrieveAPIView , ListAPIView , DestroyAPIView
from ...models import User
from django.db.models import Q
from ...permissions import IsSuperUser

class UserProfileView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
    
class UserEditProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        serializer = UserEditProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class JudgeUserListView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = JudgeListSerializer

    def get_queryset(self):
        return User.objects.filter(Q(is_staff=True)&Q(is_superuser=False))
    

class DeleteUser(DestroyAPIView):
    permission_classes = [IsSuperUser]
    queryset = User.objects.all()
    lookup_field = 'username'
    lookup_url_kwarg = 'username'
