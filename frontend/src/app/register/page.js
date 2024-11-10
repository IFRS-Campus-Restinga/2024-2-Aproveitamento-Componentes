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
                type: (email.endsWith('@aluno.restinga.ifrs.edu.br') || email.endsWith('@restinga.ifrs.edu.br')) ? 'Estudante' : 'Servidor',
                matricula: '',
                course: '',
                siape: '',
                servant_type: ''
            };
        }

    }
    return (
        <FormProfile user={user} onCancel={() => window.location.href = `/profile` } />
    );
}

RegisterPage.title = 'Cadastro de Usuários';
export default RegisterPage;
