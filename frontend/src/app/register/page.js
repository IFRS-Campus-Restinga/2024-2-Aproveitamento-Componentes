'use client'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useState, useEffect } from 'react';
import styles from './register.module.css';
import AuthService from '@/services/AuthService';
import { useAuth } from '@/context/AuthContext';
const RegisterPage = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        matricula: '',
        course: '',
        siape: '',
        servant_type: '',
        isStudent: false,
    });

    useEffect(() => {
        if (user) {
            setUserData({
                ...userData,
                name: user?.name,
                email: user?.email,
                isStudent: (user?.type === 'Estudante'),
                matricula: user?.matricula,
                course: user?.course,
                siape: user?.siape,
                servant_type: user?.servant_type
            });
        } else {
            const token = localStorage.getItem('data');
            if (token) {
                const decodedData = JSON.parse(atob(token));
                const { name, email } = decodedData;
                setUserData({
                    ...userData,
                    name: name,
                    email: email,
                    isStudent: email.endsWith('@aluno.restinga.ifrs.edu.br') || email.endsWith('@restinga.ifrs.edu.br')
                });
            }

        }

    }, []);


    const submitForm = async () => {
        console.log('Dados enviados:', userData);
        const formData = new FormData();
        formData.append('name', userData.name);
        formData.append('email', userData.email);
        formData.append('isStudent', userData.isStudent);
        if (userData.matricula) formData.append('matricula', userData.matricula);
        if (userData.course) formData.append('course', userData.course);
        if (userData.siape) formData.append('siape', userData.siape);
        if (userData.servant_type) formData.append('servant_type', userData.servant_type);

        await AuthService.CreateUser(formData).then(response => {
            console.log('Usuário criado com sucesso:', response);
            window.location.href = ('/profile');
        })
            .catch(error => {
                console.error('Erro ao criar usuário:', error);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
    };

    // Options for the Dropdown components
    const courseOptions = [
        { label: 'ADS', value: 'ADS' },
        { label: 'Lazer', value: 'Lazer' },
        { label: 'Agricultura', value: 'Agricultura' },
    ];

    const servantTypeOptions = [
        { label: 'Professor', value: 'Professor' },
        { label: 'Coordenador', value: 'Coordenador' },
        { label: 'Ensino', value: 'Ensino' },
    ];

    return (
        <form onSubmit={submitForm} className={styles.formContainer}>
            <div className={styles.formField}>
                <label htmlFor="name">Nome: </label>
                <InputText
                    className={styles.formField}
                    id="name"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                />
            </div>

            <div className={styles.formField}>
                <label htmlFor="email">Email:</label>
                <InputText
                    className={styles.formField}
                    id="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    readOnly
                />
            </div>



            {userData.isStudent ? (
                <>
                    <div className={styles.formField}>
                        <label htmlFor="matricula">Matricula:</label>
                        <InputText
                            className={styles.formField}
                            id="matricula"
                            name="matricula"
                            value={userData.matricula}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className={styles.formField}>
                        <label htmlFor="course">Curso:</label>
                        <Dropdown
                            className={styles.formField}
                            id="course"
                            name="course"
                            value={userData.course}
                            options={courseOptions}
                            onChange={(e) =>
                                setUserData((userData) => ({
                                    ...userData,
                                    course: e.value,
                                }))
                            }
                            placeholder="Selecione um curso"
                        />
                    </div>
                </>
            ) : (
                <>
                    <div className={styles.formField}>
                        <label htmlFor="siape">SIAPE:</label>
                        <InputText
                            className={styles.formField}
                            id="siape"
                            name="siape"
                            value={userData.siape}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className={styles.formField}>
                        <label htmlFor="servant_type">Tipo de servidor:</label>
                        <Dropdown
                            className={styles.formField}
                            id="servant_type"
                            name="servant_type"
                            value={userData.servant_type}
                            options={servantTypeOptions}
                            onChange={(e) =>
                                setUserData((userData) => ({
                                    ...userData,
                                    servant_type: e.value,
                                }))
                            }
                            placeholder="Selecione um tipo de servidor"
                        />
                    </div>
                </>
            )}

            <Button className={styles.submitButton} label="Salvar" type="submit" />
        </form>
    );
}

RegisterPage.title = 'Cadastro de Usuários';
export default RegisterPage;
