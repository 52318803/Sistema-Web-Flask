from flask import Flask, request, jsonify, render_template, redirect, url_for, flash, session
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
import mysql.connector
from mysql.connector import Error
from datetime import datetime

# Configuração do Flask e SQLAlchemy
app = Flask(__name__)
app.secret_key = 'sua_chave_secreta'  # Defina a chave secreta para sessões

# Adicionando a URI de conexão do banco de dados
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root753@127.0.0.1/sorveteria'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Desabilitar modificações

# Inicializando o banco de dados SQLAlchemy
db = SQLAlchemy(app)

# Inicializando o Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Modelo de Usuários
class Users(UserMixin, db.Model):  # Mudança do nome da classe para Users
    __tablename__ = 'users'  # Mudança do nome da tabela para 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    senha = db.Column(db.String(150), nullable=False)

    def __init__(self, nome, email, senha):
        self.nome = nome
        self.email = email
        self.senha = senha

    def __repr__(self):
        return f'<User {self.nome}>'

# Função para carregar o usuário pelo ID
@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(int(user_id))  # Alterado para 'Users'

# Função de conexão com o banco de dados MySQL
def connect_db():
    try:
        # Estabelece uma conexão com o banco de dados MySQL
        connection = mysql.connector.connect(
            host='127.0.0.1',
            database='sorveteria',
            user='root',
            password='root753'
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Erro ao conectar ao MySQL: {e}")
        return None

# Rota para login (GET e POST)
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        senha = request.form.get('password')

        print(f"Email recebido: {email}")  # Verifique o valor do email
        print(f"Senha recebida: {senha}")  # Verifique o valor da senha

        # Verifique se os campos estão preenchidos
        if not email or not senha:
            flash('Por favor, preencha todos os campos.', 'error')
            return "Por favor, preencha todos os campos.", 400  # Retorna uma string com mensagem de erro

        # Encontra o usuário pelo email
        user = Users.query.filter_by(email=email).first()

        if not user:
            # Flash de erro se o usuário não existir
            flash('Usuário não cadastrado.', 'error')
            return "Usuário não encontrado.", 400  # Retorna uma string com a mensagem de erro
        elif not check_password_hash(user.senha, senha):
            # Flash de erro se a senha for incorreta
            flash('Senha incorreta.', 'error')
            return "Senha incorreta.", 400  # Retorna uma string com a mensagem de erro
        else:
            login_user(user)  # Realiza o login do usuário
            flash('Login realizado com sucesso!', 'success')
            return redirect(url_for('home'))   # Retorna sucesso como string simples para o frontend

    # Se for GET, exibe o formulário de login
    return render_template('login.html')

@app.route('/')
def home():
    return render_template('index.html')

# Rota para o cadastro de usuário
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        hashed_password = generate_password_hash(password)

        # Criar um novo usuário no banco de dados
        new_user = Users(nome=name, email=email, senha=hashed_password)  # Alterado para 'Users'
        db.session.add(new_user)
        db.session.commit()

        flash('Cadastro realizado com sucesso!', 'success')
        return redirect(url_for('login'))

    return render_template('register.html')

# Rota para a página inicial
@app.route('/')
def index():
    if not current_user.is_authenticated:
        flash("Você precisa estar logado para acessar esta página", 'warning')
        return redirect(url_for('login'))  # Redireciona para a página de login se o usuário não estiver logado
    return render_template('index.html')  # Se estiver logado, exibe a página inicial

# Rota protegida (apenas para usuários logados)
@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html')

# Rota de logout
@app.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    logout_user()  # Realiza o logout
    flash('Você foi desconectado com sucesso!', 'success')
    return redirect(url_for('home'))  # Redireciona para o index após o logout


# Função para inicializar o banco de dados MySQL (se necessário)
def init_db():
    conn = connect_db()
    if conn is not None:
        cursor = conn.cursor()
        cursor.execute(''' 
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            )
        ''')
        cursor.execute(''' 
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                items TEXT NOT NULL,
                total DECIMAL(10, 2) NOT NULL,
                user_id INT,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        ''')
        conn.commit()
        cursor.close()
        conn.close()
    else:
        print("Não foi possível conectar ao banco de dados para inicializar.")

# Inicia o aplicativo Flask
if __name__ == '__main__':
    init_db()  # Inicializa o banco de dados na primeira execução
    app.run(debug=True)


@app.route('/finalizar_compra', methods=['GET', 'POST'])
def finalizar_compra():
    if request.method == 'POST':
        # Recebe os dados do carrinho diretamente dos campos de formulário
        item_ids = request.form.getlist('item_id')
        item_nomes = request.form.getlist('item_nome')
        item_precos = request.form.getlist('item_preco')
        item_quantidades = request.form.getlist('item_quantidade')

        # Verifica se o carrinho está vazio
        if not item_ids:
            flash('Carrinho vazio!', 'error')
            return redirect(url_for('home'))  # Redireciona de volta para a página inicial

        # Converte os dados para uma lista de dicionários
        cart = []
        for i in range(len(item_ids)):
            cart.append({
                'id': item_ids[i],
                'nome': item_nomes[i],
                'preco': float(item_precos[i]),
                'quantidade': int(item_quantidades[i])
            })

        # Calcule o valor total do pedido
        valor_total = sum(item['preco'] * item['quantidade'] for item in cart)

        # Salve o pedido no banco de dados
        pedido = Pedido(
            usuario_id=current_user.id,  # Usando o id do usuário logado
            valor_total=valor_total,
            itens=str(cart)  # Salvando o carrinho como uma string simples
        )

        # Adiciona o pedido no banco de dados e faz o commit
        db.session.add(pedido)
        db.session.commit()

        flash('Compra finalizada com sucesso!', 'success')
        return redirect(url_for('home'))


# @app.route('/logout', methods=['GET', 'POST'])
# @login_required
# def logout():
#     logout_user()  # Realiza o logout
#     flash('Você foi desconectado com sucesso!', 'success')
#     return redirect(url_for('home'))


@app.route('/logout', methods=['GET', 'POST']) 
def any_page():
    logout_user()  # Desautentica o usuário
    return redirect(url_for('home'))

db = SQLAlchemy()

class Pedido(db.Model):
    __tablename__ = 'pedidos'

    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    data_pedido = db.Column(db.DateTime, default=datetime.utcnow)
    valor_total = db.Column(db.Float, nullable=False)
    itens = db.Column(db.JSON, nullable=False)  # Usando JSON para armazenar os itens do pedido

    usuario = db.relationship('User', backref=db.backref('pedidos', lazy=True))

    def __repr__(self):
        return f'<Pedido {self.id} - {self.valor_total}>'
    
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha = db.Column(db.String(120), nullable=False)
    pedidos = db.relationship('Pedido', backref='usuario', lazy=True)

db.create_all()

