from flask import Flask
from flask_cors import CORS

def create_app(config_class='app.config.Config'):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    CORS(app)

    # Inicializar Banco de Dados
    from .infrastructure.database.models import db
    db.init_app(app)

    # Injeção de Dependências
    from .infrastructure.database.repositories import SQLAlchemyListRepository, SQLAlchemyItemRepository
    from .application.use_cases import ListUseCases, ItemUseCases
    
    list_repo = SQLAlchemyListRepository()
    item_repo = SQLAlchemyItemRepository()
    
    list_use_cases = ListUseCases(list_repo)
    item_use_cases = ItemUseCases(item_repo, list_repo)

    # Registrar Rotas
    from .infrastructure.web.routes import create_api_blueprint
    api_bp = create_api_blueprint(list_use_cases, item_use_cases)
    app.register_blueprint(api_bp)

    with app.app_context():
        db.create_all()

    return app
