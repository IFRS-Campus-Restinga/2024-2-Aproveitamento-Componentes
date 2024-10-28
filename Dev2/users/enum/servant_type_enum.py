from enum import Enum


USER_TYPES = {
    'Professor': 'Professor',
    'Ensino': 'Ensino',
    'Coordenador': 'Coordenador'
}

class ServantTypeEnum(Enum):
    TEACHER = 'Professor'
    ENSINO = 'Ensino'
    COORDINATOR = 'Coordenador'


    def getTypeString(self):
        print(self.value)
        if self.value not in USER_TYPES:
            raise Exception('Tipo de usuário não mapeado!')
        return USER_TYPES[self.value]
    
    def __eq__(self, value: object) -> bool:
        return super().__eq__(value) or self.value == value

    def __repr__(self) -> str:
        return super().__repr__()
