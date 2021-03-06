from typing import List

from sqlalchemy.sql.operators import or_

from . import database, Tip


def add_tip(tip: Tip) -> Tip:
    database.session.add(tip)
    database.session.commit()
    return tip


def delete_tip(tip: Tip) -> None:
    database.session.delete(tip)
    database.session.commit()


def delete_tip_by_id(tip_id: str) -> None:
    database.session.query(Tip).filter(Tip.id == tip_id).delete()
    database.session.commit()


def get_tips(page: int, page_size: int) -> List[Tip]:
    return database.session.query(Tip).limit(page_size).offset(page * page_size).all()


def get_tips_count() -> int:
    return database.session.query(Tip).count()


def search_tips(text_to_search: str, page: int, page_size: int) -> List[Tip]:
    text_to_search = "%{}%".format(text_to_search)
    return database.session.query(Tip).filter(or_(
                Tip.title.ilike(text_to_search),
                Tip.body.ilike(text_to_search)
        )).limit(page_size).offset(page * page_size).all()
