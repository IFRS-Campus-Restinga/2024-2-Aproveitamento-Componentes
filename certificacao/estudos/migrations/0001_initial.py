# Generated by Django 5.0.3 on 2024-10-13 21:46

import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Usuario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(help_text='Digite seu nome:', max_length=100, validators=[django.core.validators.MinLengthValidator(1)], verbose_name='Nome')),
                ('email', models.EmailField(help_text='Digite seu email:', max_length=100, unique=True, validators=[django.core.validators.MinLengthValidator(1)], verbose_name='Email')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Anexo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(help_text='Digite o nome do anexo:', max_length=100, validators=[django.core.validators.MinLengthValidator(1)], verbose_name='Nome do anexo')),
                ('tipo', models.CharField(choices=[('PDF', 'Pdf'), ('Documento', 'Doc'), ('Imagem', 'Img'), ('Outro', 'Outro')], help_text='Selecione o tipo do anexo:', max_length=20, verbose_name='Tipo do anexo')),
                ('arquivo', models.FileField(help_text='Insira o arquivo do anexo:', upload_to='uploads/arquivos/', validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'jpg', 'png'])], verbose_name='Arquivo do anexo')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Cronograma',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(blank=True, help_text='Digite o nome do cronograma:', max_length=100, validators=[django.core.validators.MinLengthValidator(1)], verbose_name='Nome do cronograma')),
                ('etapa', models.CharField(choices=[('Período de Solicitações', 'Solicitacao'), ('Período de Análises', 'Analise'), ('Homologação', 'Homologacao'), ('Nova etapa', 'Nova')], max_length=100)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Curso',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(help_text='Digite o nome do curso:', max_length=100, validators=[django.core.validators.MinLengthValidator(1)], verbose_name='Nome')),
                ('sigla', models.CharField(help_text='Digite a sigla do curso:', max_length=5, validators=[django.core.validators.MinLengthValidator(2)], verbose_name='Sigla')),
                ('codigo', models.CharField(help_text='Digite o código do curso:', max_length=20, unique=True, validators=[django.core.validators.MinLengthValidator(1)], verbose_name='Código')),
                ('duracao', models.IntegerField(help_text='Digite quantos semestres tem o curso:', verbose_name='Duração')),
                ('grau', models.CharField(choices=[('Graduação', 'Graduacao'), ('Tecnólogo', 'Tecnologo')], max_length=20)),
                ('modalidade', models.CharField(choices=[('Presencial', 'Presencial'), ('EAD', 'Ead'), ('Híbrido', 'Hibrido')], max_length=10)),
                ('ativo', models.BooleanField(default=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Aluno',
            fields=[
                ('usuario_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, to='estudos.usuario')),
                ('matricula', models.IntegerField(help_text='Digite sua matrícula:', primary_key=True, serialize=False, unique=True, verbose_name='Matrícula')),
            ],
            options={
                'abstract': False,
            },
            bases=('estudos.usuario',),
        ),
        migrations.CreateModel(
            name='Servidor',
            fields=[
                ('usuario_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, to='estudos.usuario')),
                ('siape', models.IntegerField(help_text='Digite seu siape:', primary_key=True, serialize=False, unique=True, verbose_name='Siape')),
                ('cargo', models.CharField(choices=[('Professor', 'Professor'), ('Coordenador', 'Coordenador'), ('CRE', 'Cre'), ('Administrador', 'Administrador')], help_text='Selecione o cargo do servidor:', max_length=30, verbose_name='Cargo')),
            ],
            options={
                'abstract': False,
            },
            bases=('estudos.usuario',),
        ),
        migrations.CreateModel(
            name='Disciplina',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(help_text='Digite o nome da disciplina:', max_length=100, validators=[django.core.validators.MinLengthValidator(1)], verbose_name='Nome da Disciplina')),
                ('cargaHoraria', models.CharField(help_text='Digite a carga horária da disciplina:', max_length=10, validators=[django.core.validators.MinLengthValidator(1)], verbose_name='Carga Horária')),
                ('ementa', models.TextField(blank=True, help_text='Digite a ementa da disciplina:', max_length=500, verbose_name='Ementa')),
                ('prerequisitos', models.ManyToManyField(blank=True, help_text='Selecione as disciplinas que são pré-requisitos:', related_name='disciplinas_requisitadas', to='estudos.disciplina', verbose_name='Pré-Requisitos')),
                ('professor', models.ForeignKey(blank=True, help_text='Selecione o professor da disciplina:', null=True, on_delete=django.db.models.deletion.SET_NULL, to='estudos.servidor', verbose_name='Professor')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Edital',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.CharField(help_text='Digite o título do edital:', max_length=100, validators=[django.core.validators.MinLengthValidator(1)], verbose_name='Título do edital')),
                ('numero', models.CharField(help_text='Digite o número do edital:', max_length=30, unique=True, validators=[django.core.validators.MinLengthValidator(1)], verbose_name='Número do edital')),
                ('descricao', models.TextField(help_text='Digite o conteúdo do edital:', max_length=500, validators=[django.core.validators.MinLengthValidator(1)], verbose_name='Texto do edital')),
                ('dataPubli', models.DateTimeField(help_text='Digite a data de publicação do edital:', verbose_name='Data de Publicação')),
                ('cronograma', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='estudos.cronograma')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PPC',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tituloAno', models.CharField(help_text='Digite o ano de inicio de vigência:', max_length=10, validators=[django.core.validators.MinLengthValidator(4)], verbose_name='Ano')),
                ('dataInicio', models.DateField(help_text='Digite a data de início do PPC:', verbose_name='Data Inicio')),
                ('disciplinas', models.ManyToManyField(blank=True, related_name='ppcs', to='estudos.disciplina')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Retificacao',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data', models.DateField(help_text='Digite a data da retificação:', verbose_name='Data da Retificação')),
                ('descricao', models.TextField(help_text='Digite a descrição da retificação:', max_length=500, validators=[django.core.validators.MinLengthValidator(1)], verbose_name='Descrição')),
                ('edital', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='retificacoes', to='estudos.edital')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Semestre',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.CharField(help_text='Digite o título do semestre:', max_length=20, unique=True, validators=[django.core.validators.MinLengthValidator(1)], verbose_name='Título')),
                ('dataInicio', models.DateField(help_text='Digite a data de início do semestre:', verbose_name='Data Inicio')),
                ('dataFim', models.DateField(help_text='Digite a data de fim do semestre:', verbose_name='Data Fim')),
                ('cursos', models.ManyToManyField(help_text='Selecione os cursos ativos neste semestre.', related_name='semestres', to='estudos.curso', verbose_name='Cursos Ativos')),
                ('edital', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='estudos.edital')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Solicitacao',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tipo', models.CharField(choices=[('APROVEITAMENTO', 'Aproveitamento'), ('CERTIFICACAO', 'Certificação')], help_text='Selecione o tipo de solicitação:', max_length=20, verbose_name='Tipo de Solicitação')),
                ('disciplina', models.CharField(help_text='Digite a disciplina:', max_length=100, validators=[django.core.validators.MinLengthValidator(1)], verbose_name='Disciplina')),
                ('experiencia', models.TextField(blank=True, help_text='Descreva sua experiência relacionada, se aplicável:', max_length=500, null=True, validators=[django.core.validators.MinLengthValidator(1)], verbose_name='Experiência')),
                ('status', models.CharField(choices=[('Solicitação realizada', 'Solicitado'), ('Em análise do CRE', 'Cre Analise'), ('Em análise da Coordenação', 'Coo Analise'), ('Em análise do Professor', 'Pro Analise'), ('Indeferido pelo CRE', 'Cre Indeferido'), ('Indeferido pela Coordenação', 'Coo Indeferido'), ('Prova agendada', 'Prova'), ('Em homologação', 'Retorno'), ('Indeferido', 'Indeferido'), ('Deferido', 'Deferido'), ('Finalizado', 'Finalizado')], help_text='Selecione o status da solicitação:', max_length=50, verbose_name='Status')),
                ('documentos', models.ManyToManyField(blank=True, help_text='Anexe os documentos:', to='estudos.anexo', verbose_name='Documentos Anexos')),
                ('aluno', models.ForeignKey(help_text='Selecione o aluno:', on_delete=django.db.models.deletion.CASCADE, to='estudos.aluno', verbose_name='Aluno')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Prova',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data', models.DateField(help_text='Informe a data de aplicação da prova:', verbose_name='Data de Aplicação')),
                ('disciplina', models.ForeignKey(help_text='Selecione a disciplina correspondente:', on_delete=django.db.models.deletion.CASCADE, related_name='provas', to='estudos.disciplina', verbose_name='Disciplina')),
                ('aluno', models.ForeignKey(help_text='Selecione o aluno que realizará a prova:', on_delete=django.db.models.deletion.CASCADE, related_name='provas', to='estudos.aluno', verbose_name='Aluno')),
                ('professor', models.ForeignKey(blank=True, help_text='Selecione o professor responsável pela prova:', limit_choices_to={'cargo': 'PROFESSOR'}, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='provas', to='estudos.servidor', verbose_name='Professor Responsável')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='curso',
            name='coordenador',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='estudos.servidor'),
        ),
    ]
