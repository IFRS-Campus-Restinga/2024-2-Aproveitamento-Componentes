from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings

from django.template.loader import get_template

def send_custom_email(subject, template_name, context, recipient_list):
    """
    Função para envio de e-mails com suporte a templates.
    """
    try:
        print("tentando ver template")
        template = get_template('templates/geral.html')  # Substitua pelo caminho que você está usando
        print(template)  # Deve retornar o template ou levantar um erro se não for encontrado
        print("try do email")
        print(subject)
        print(template_name)
        print(context)
        print(recipient_list)
        # Renderiza o conteúdo do e-mail usando um template HTML
        message = render_to_string(template_name, context)
        print("email aqui")
        print(message)
        # Envia o e-mail
        send_mail(
            subject,
            '',  # Corpo do e-mail em texto puro (pode ser vazio se for só HTML)
            settings.EMAIL_HOST_USER,  # Remetente configurado
            recipient_list,
            html_message=message  # Mensagem em HTML
        )
        return True
    except Exception as e:
        print(f"Erro ao enviar e-mail: {e}")
        return False
