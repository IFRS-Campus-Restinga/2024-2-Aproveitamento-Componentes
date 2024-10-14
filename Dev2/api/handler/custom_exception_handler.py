from rest_framework.views import exception_handler as drf_exception_handler
from rest_framework import exceptions

def custom_exception_handler(exc, context):
    response = drf_exception_handler(exc, context)

    if response is not None:
        if isinstance(exc, exceptions.NotFound):
            response.data = {'status': 'error', 'message': 'O recurso solicitado não foi encontrado.'}
        elif isinstance(exc, exceptions.PermissionDenied):
            response.data = {'status': 'error', 'message': 'Você não tem permissão para realizar esta ação.'}
        elif isinstance(exc, exceptions.ValidationError):
            response.data = {'status': 'error', 'message': 'Os dados enviados são inválidos.'}
        elif isinstance(exc, exceptions.AuthenticationFailed):
            response.data = {'status': 'error', 'message': 'Falha na autenticação.'}
        elif isinstance(exc, exceptions.NotAuthenticated):
            response.data = {'status': 'error', 'message': 'Autenticação necessária.'}
        elif isinstance(exc, exceptions.ParseError):
            response.data = {'status': 'error', 'message': 'Erro ao analisar a solicitação.'}
        elif isinstance(exc, exceptions.MethodNotAllowed):
            response.data = {'status': 'error', 'message': 'Método HTTP não permitido.'}
        elif isinstance(exc, exceptions.NotAcceptable):
            response.data = {'status': 'error', 'message': 'O cliente não aceita as representações de conteúdo disponíveis.'}
        elif isinstance(exc, exceptions.UnsupportedMediaType):
            response.data = {'status': 'error', 'message': 'Tipo de mídia não suportado.'}
        elif isinstance(exc, exceptions.Throttled):
            response.data = {'status': 'error', 'message': 'Excedeu a taxa de solicitações permitida.'}
        else:
            response.data = {'status': 'error', 'message': 'Ocorreu um erro inesperado.'}

        response.data['status_code'] = response.status_code

    return response