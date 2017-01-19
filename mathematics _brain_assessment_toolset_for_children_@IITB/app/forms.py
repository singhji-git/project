from django import forms
from .models import UserInfo,BatchUploadModel
from django.contrib.auth.models import User
from django.forms import Textarea, FileInput, DateInput, TextInput, PasswordInput
# from functools import partial
# DateInput = partial(forms.DateInput, {'class': 'datepicker'})

"""
    Class

"""
'''class UserInfoForm(forms.ModelForm):
	class Meta:
		model = UserInfo
		exclude = ['user']
        widgets={

        }
'''




class UserInfoForm(forms.ModelForm):
    class Meta:
        model=UserInfo
        exclude=['user']
        widgets = {
        'DOB': DateInput(attrs={'class': 'datepicker',
                                'data-parsley-required':True, 
                                'data-parsley-trigger':'change',
                                'data-parsley-pattern':'^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$',
                                'data-parsley-error-message':'Enter a valid date',
        }),
        'first_name' : TextInput(attrs={
                                            'data-parsely-required':True,
                                            'data-parsley-trigger':'change',
                                            'data-parsely-required-message':'Enter First Name',
                                            'data-parsely-error-message':'Enter First Name'
                                                }),
        'last_name' : TextInput(attrs={
                                            'data-parsely-required':True,
                                            'data-parsley-trigger':'change',
                                            'data-parsely-required-message':'Enter Last Name',
                                            'data-parsely-error-message':'Enter Last Name'
                                                }),
        
        }



"""
    Class
        Form for user login     
"""
class UserForm(forms.ModelForm):
    class Meta:
        model = User 
        password = forms.CharField(widget=forms.PasswordInput())
        fields = ['username','password']
        widgets = {
            'password': forms.PasswordInput(attrs={
                                            'data-parsely-required':True,
                                            'data-parsley-trigger':'change',
                                            'data-parsely-required-message':'Enter Password',

                                                }),
            'username' : forms.TextInput(attrs={
                                            'data-parsely-required':True,
                                            'data-parsley-trigger':'change',
                                            'data-parsely-required-message':'Enter User Name'
                                                })
        }


"""
    Class
        Form for upload for batch registration file     
"""
class BatchUploadFileForm(forms.ModelForm):
    class Meta:
        model = BatchUploadModel
        fields = ['data_excel_file']
        widgets = {
            'data_excel_file':FileInput(attrs={'data-parsley-filemaxmegabytes':'1' ,'data-parsley-trigger':'change', 'data-parsley-fileextension':'xlsx'}),
        }

# class BatchUploadFileForm(forms.Form):
#     data_excel_file=forms.FileField(widget=forms.FileInput(attrs={'data-parsley-filemaxmegabytes':'1' ,'data-parsley-trigger':'change', 'data-parsley-fileextension':'xlsx'}))


"""
    Class
        Form for password reset form
"""
class PasswordResetRequestForm(forms.Form):
    email = forms.EmailField(label=("Email"))



"""
    Class
        Form for resetting of password     
"""
class SetPasswordForm(forms.Form):
    """
    A form that lets a user change set their password without entering the old
    password
    """
    error_messages = {
        'password_mismatch': ("The two password fields didn't match."),
        }
    new_password1 = forms.CharField(label=("New password"),
                                    widget=forms.PasswordInput)
    new_password2 = forms.CharField(label=("New password confirmation"),
                                    widget=forms.PasswordInput)

    def clean_new_password2(self):
        password1 = self.cleaned_data.get('new_password1')
        password2 = self.cleaned_data.get('new_password2')
        if password1 and password2:
            if password1 != password2:
                raise forms.ValidationError(
                    self.error_messages['password_mismatch'],
                    code='password_mismatch',
                    )
        return password2
