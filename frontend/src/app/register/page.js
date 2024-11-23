'use client'
import { useAuth } from '@/context/AuthContext';
import FormProfile from '@/components/Forms/Profile/ProfileForm';
const RegisterPage = () => {
    var { user } = useAuth();
    if (!user) {
        const token = localStorage.getItem('data');
        if (token) {
            const decodedData = JSON.parse(atob(token));
            const { name, email } = decodedData;
            user = {
                id: '',
                name: name,
                email: email,
                type: emailType(email),
                matricula: '',
                course: '',
                siape: '',
                servant_type: ''
            };
        }

    }
    function emailType(email) {
        const [localPart, domain] = email.split('@');
        if (domain.includes('aluno')) {
            return 'Estudante';
        }
        if (/^\d+$/.test(localPart)) {
            return 'Estudante';
        }
        return 'Servidor';
    }
    return (
        <FormProfile user={user} onCancel={() => window.location.href = `/profile`} />
    );
}

RegisterPage.title = 'Cadastro de Usuários';
export default RegisterPage;
