from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.entities import (
    Project, Contract, ContractRule, WeatherObservation,
    Entitlement, Evidence, ReviewDecision, AuditLog, ClaimNotice
)

class ProjectRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Project]:
        return self.db.query(Project).all()

    def get_by_id(self, project_id: int) -> Optional[Project]:
        return self.db.query(Project).filter(Project.id == project_id).first()

    def get_by_code(self, code: str) -> Optional[Project]:
        return self.db.query(Project).filter(Project.code == code).first()

    def create(self, project: Project) -> Project:
        self.db.add(project)
        self.db.commit()
        self.db.refresh(project)
        return project


class EntitlementRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Entitlement]:
        return self.db.query(Entitlement).all()

    def get_by_id(self, entitlement_id: int) -> Optional[Entitlement]:
        return self.db.query(Entitlement).filter(Entitlement.id == entitlement_id).first()

    def get_by_project_id(self, project_id: int) -> List[Entitlement]:
        return self.db.query(Entitlement).filter(Entitlement.project_id == project_id).all()

    def update(self, entitlement: Entitlement) -> Entitlement:
        self.db.commit()
        self.db.refresh(entitlement)
        return entitlement


class ContractRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_project_id(self, project_id: int) -> Optional[Contract]:
        return self.db.query(Contract).filter(Contract.project_id == project_id).first()

    def get_rule_by_id(self, rule_id: int) -> Optional[ContractRule]:
        return self.db.query(ContractRule).filter(ContractRule.id == rule_id).first()

    def create_rule(self, rule: ContractRule) -> ContractRule:
        self.db.add(rule)
        self.db.commit()
        self.db.refresh(rule)
        return rule

    def update_rule(self, rule: ContractRule) -> ContractRule:
        self.db.commit()
        self.db.refresh(rule)
        return rule


class AuditRepository:
    def __init__(self, db: Session):
        self.db = db

    def log(self, action: str, details: str, actor: str = "System Engine", project_id: Optional[int] = None, entitlement_id: Optional[int] = None) -> AuditLog:
        entry = AuditLog(
            project_id=project_id,
            entitlement_id=entitlement_id,
            action=action,
            actor=actor,
            details=details
        )
        self.db.add(entry)
        self.db.commit()
        self.db.refresh(entry)
        return entry

    def get_all(self, project_id: Optional[int] = None) -> List[AuditLog]:
        query = self.db.query(AuditLog)
        if project_id:
            query = query.filter(AuditLog.project_id == project_id)
        return query.order_by(AuditLog.timestamp.desc()).all()
