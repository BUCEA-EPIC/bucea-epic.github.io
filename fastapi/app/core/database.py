import os
from sqlalchemy import create_engine, text, inspect
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import DB_PATH, logger

SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 依赖注入
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 数据库迁移逻辑
def init_db():
    try:
        Base.metadata.create_all(bind=engine)
        
        # 自动迁移检查
        inspector = inspect(engine)
        if not inspector.has_table("submissions"):
            return

        columns = [c['name'] for c in inspector.get_columns('submissions')]
        
        with engine.connect() as conn:
            # 检查并添加新字段
            if 'score' not in columns:
                conn.execute(text("ALTER TABLE submissions ADD COLUMN score INTEGER DEFAULT 0"))
            if 'is_starred' not in columns:
                conn.execute(text("ALTER TABLE submissions ADD COLUMN is_starred BOOLEAN DEFAULT 0"))
            if 'is_graded' not in columns:
                conn.execute(text("ALTER TABLE submissions ADD COLUMN is_graded BOOLEAN DEFAULT 0"))
            if 'remark' not in columns:
                conn.execute(text("ALTER TABLE submissions ADD COLUMN remark TEXT DEFAULT ''"))
            conn.commit()
            
        if os.path.exists(DB_PATH):
            os.chmod(DB_PATH, 0o666)
            
        logger.info("Database initialized and checked for migrations.")
    except Exception as e:
        logger.warning(f"数据库初始化权限警告: {e}")