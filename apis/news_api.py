from flask_restplus import Namespace, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request

from models.news_model import post_full_model, post_request_model, fields
from services import news_service, check_page

api = Namespace('news', description='News related operations')

get_news_post = api.model(
    'post_full_model',
    post_full_model,
)

add_news_post = api.model(
    'post_request_model',
    post_request_model,
)

post_list = api.model(
    'list_of_posts',
    {
        "posts":
            fields.List(
                fields.Nested(get_news_post)
            )
    }
)


@api.route('')
class Posts(Resource):
    @api.doc('newest_posts', params={'page': 'page number'})
    @api.marshal_with(post_list, code=200)
    def get(self):
        """Get newest posts"""
        page = check_page(request)
        return news_service.get_newest_posts(page), 200

    @api.doc('make_new_post', security='apikey')
    @api.expect(add_news_post, validate=True)
    @jwt_required
    def post(self):
        """Make post in news"""
        return news_service.add_post(get_jwt_identity(), **api.payload), 201

    @api.doc('delete_post', params={'post_id': 'post ID'}, security='apikey')
    @jwt_required
    def delete(self):
        """Delete post from news"""
        return news_service.delete_post(get_jwt_identity(), request.args.get("post_id")), 201


@api.route('/search')
class SearchPosts(Resource):
    @api.doc('search_posts', params={'page': 'page number', 'text': 'text to search'})
    @api.marshal_with(post_list, code=200)
    def get(self):
        """Search posts"""
        page = check_page(request)
        return news_service.search_posts(page, request.args.get("text")), 200