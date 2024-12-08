'use client'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useState, useEffect } from 'react';
import styles from './ProfileForm.module.css';
import AuthService from '@/services/AuthService';
import { handleApiResponse } from '@/libs/apiResponseHandler';

const FormProfile = ({ user = false, onCancel, admEditing = false }) => {
    const [userData, setUserData] = useState({
        id: '',
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
                id: user?.id,
                name: user?.name,
                email: user?.email,
                isStudent: (user?.type === 'Estudante'),
                matricula: user?.matricula,
                course: user?.course,
                siape: user?.siape,
                servant_type: user?.servant_type
            });
        }
    }, []);

    const submitForm = async () => {
        let response;
        console.log('Dados enviados:', userData);

        const formData = new FormData();
        formData.append('name', userData.name);
        formData.append('email', userData.email);
        formData.append('is_student', userData.isStudent);
        if (userData.matricula) formData.append('matricula', userData.matricula);
        if (userData.course) formData.append('course', userData.course);
        if (userData.siape) formData.append('siape', userData.siape);
        if (userData.servant_type) formData.append('servant_type', userData.servant_type);
        if (userData.id !== '') {
            response = await AuthService.UpdateUser(userData.id, formData)
        } else {
            response = await AuthService.CreateUser(formData)
        };
        handleApiResponse(response);
    }
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

    const shouldShowAllOptions =
    admEditing || (userData.servant_type !== 'Professor' &&
        userData.servant_type !== '' &&
        userData.servant_type !== null);

const filteredServantTypeOptions = shouldShowAllOptions
    ? servantTypeOptions
    : servantTypeOptions.filter((option) => option.value === 'Professor');

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
                            value={userData.matricula || ''}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className={styles.formField}>
                        <label htmlFor="course">Curso:</label>
                        <Dropdown
                            className={styles.formField}
                            id="course"
                            name="course"
                            value={userData.course || ''}
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
                            value={userData.siape || ''}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className={styles.formField}>
                        <label htmlFor="servant_type">Tipo de servidor:</label>
                        <Dropdown
                            className={styles.formField}
                            id="servant_type"
                            name="servant_type"
                            value={userData.servant_type || ''}
                            options={filteredServantTypeOptions}
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
            <div className="flex space-x-36">
            <Button className={styles.submitButton} label="Salvar" type="submit" />
            <Button className={styles.submitButton} label="Voltar" type= "button" onClick={onCancel}/>
            </div>
        </form>
    );
}

export default FormProfile;
