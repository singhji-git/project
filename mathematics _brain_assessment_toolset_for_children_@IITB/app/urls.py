from django.conf.urls import url

from . import views
from django.conf import settings
from django.conf.urls.static import static
import re

urlpatterns = [
     url(r'^test/$', 'app.views.test'),
     url(r'^$', 'app.views.base',name='3'),
     url(r'^list/$', 'app.views.themelist'),
     url(r'^subjectlist/$', 'app.views.subjectlist'),
     url(r'^profile/$', 'app.views.profile'),
     url(r'^leaderboard/$', 'app.views.leaderboard_redirect'),
     url(r'^leaderboard/(?P<page_no>\d+)/$', 'app.views.leaderboard'),
     url(r'^invalid/$', 'app.views.invalid'),
     url(r'^loggedout/$', 'app.views.loggedmeout'),
     url(r'^games/(?P<subjectname>\w+)/(?P<themename>\w+)$', 'app.views.playgame'),
     url(r'^test/$', 'app.views.test'),
     url(r'^submitdata/$', 'app.views.submitdata'),
     url(r'^lti_send_score/$', 'app.views.lti_send_score'),
     url(r'^settings/$', 'app.views.settings'),
     url(r'^anagrams/$','app.views.anagrams'),
     url(r'^activate/(?P<key>.+)$', 'app.views.activation'),        
     url(r'^new-activation-link/(?P<user_id>\d+)/$', 'app.views.new_activation_link'),
     url(r'^lti_data$','app.views.lti_data'),
     url(r'^newdashboard$','app.views.newDashBoard'),
     url(r'^batch','app.views.batch_registration'),
     url(r'^account/reset_password_confirm/(?P<uidb64>[0-9A-Za-z]+)-(?P<token>.+)/$','app.views.reset',name='reset_password_confirm'),
     url(r'^forget/$', 'app.views.forget'),
     url(r'^leaderboard/(?P<subject_name>\w+)/(?P<page_no>\d+)/$', 'app.views.subject_leaderboard'),
     url(r'^leaderboard/(?P<subject_name>\w+)/$', 'app.views.subject_leaderboard_redirect'),
     url(r'^chart/(?P<subjectname>\w+)/(?P<themename>\w+)', 'app.views.get_user_performance'),
]

urlpatterns+=static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns+=static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)