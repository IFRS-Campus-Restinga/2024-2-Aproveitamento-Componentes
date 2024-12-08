from django.http import HttpResponse
from django.shortcuts import render
from django.core.mail import send_mail

def send_email(request):
    send_mail("Assunto", "Email que estou mandando", "teste@teste.com.br", ["2019010480@restinga.ifrs.edu.br"])
    return HttpResponse("ola")