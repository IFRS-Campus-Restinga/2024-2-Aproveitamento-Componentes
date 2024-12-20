from enum import Enum


USER_TYPES = {
    'Student': 'Estudante',
    'Servant': 'Servidor'
}

class UserTypeEnum(Enum):
    STUDENT = 'Student'
    SERVANT = 'Servant'


    def getTypeString(self):
        if self.value not in USER_TYPES:
            raise Exception('Tipo de usuário não mapeado!')
        return USER_TYPES[self.value]
    
    def __eq__(self, value: object) -> bool:
        return super().__eq__(value) or self.value == value

    def __repr__(self) -> str:
        return super().__repr__()
