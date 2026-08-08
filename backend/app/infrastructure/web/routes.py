from flask import Blueprint, request, jsonify

def create_api_blueprint(list_use_cases, item_use_cases):
    bp = Blueprint('api', __name__, url_prefix='/api')

    @bp.route('/lists', methods=['POST'])
    def create_list():
        data = request.get_json()
        if not data or not data.get('name'):
            return jsonify({'error': 'Name is required'}), 400
            
        try:
            new_list = list_use_cases.create_list(data['name'], data.get('budget'))
            return jsonify(new_list.to_dict()), 201
        except ValueError as e:
            return jsonify({'error': str(e)}), 400

    @bp.route('/lists', methods=['GET'])
    def get_lists():
        lists = list_use_cases.get_all_lists()
        return jsonify([l.to_dict() for l in lists]), 200

    @bp.route('/lists/<int:id>', methods=['GET'])
    def get_list(id):
        s_list = list_use_cases.get_list(id)
        if not s_list:
            return jsonify({'error': 'Not found'}), 404
        return jsonify(s_list.to_dict()), 200

    @bp.route('/lists/<int:id>', methods=['PUT'])
    def update_list(id):
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        try:
            s_list = list_use_cases.update_list(id, data.get('name'), data.get('budget'))
            return jsonify(s_list.to_dict()), 200
        except ValueError as e:
            return jsonify({'error': str(e)}), 400

    @bp.route('/lists/<int:id>', methods=['DELETE'])
    def delete_list(id):
        try:
            list_use_cases.delete_list(id)
            return jsonify({'message': 'List deleted successfully'}), 200
        except ValueError as e:
            return jsonify({'error': str(e)}), 404

    @bp.route('/lists/<int:list_id>/items', methods=['POST'])
    def add_item(list_id):
        data = request.get_json()
        if not data or not data.get('name'):
            return jsonify({'error': 'Name is required'}), 400
            
        try:
            item = item_use_cases.add_item(
                list_id=list_id,
                name=data['name'],
                category=data.get('category'),
                quantity=data.get('quantity', 1),
                unit=data.get('unit', 'un'),
                unit_price=data.get('unit_price', 0)
            )
            return jsonify(item.to_dict()), 201
        except ValueError as e:
            return jsonify({'error': str(e)}), 400

    @bp.route('/lists/<int:list_id>/items', methods=['GET'])
    def get_items(list_id):
        try:
            items = item_use_cases.get_items_by_list(list_id)
            return jsonify([i.to_dict() for i in items]), 200
        except ValueError as e:
            return jsonify({'error': str(e)}), 404

    @bp.route('/items/<int:id>', methods=['PUT'])
    def update_item(id):
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        try:
            item = item_use_cases.update_item(id, data)
            return jsonify(item.to_dict()), 200
        except ValueError as e:
            return jsonify({'error': str(e)}), 400

    @bp.route('/items/<int:id>', methods=['DELETE'])
    def delete_item(id):
        try:
            item_use_cases.delete_item(id)
            return jsonify({'message': 'Item deleted successfully'}), 200
        except ValueError as e:
            return jsonify({'error': str(e)}), 404

    @bp.route('/items/<int:id>/purchased', methods=['PATCH'])
    def toggle_purchased(id):
        data = request.get_json()
        purchased = data.get('purchased') if data else None
        
        try:
            item = item_use_cases.toggle_purchased(id, purchased)
            return jsonify(item.to_dict()), 200
        except ValueError as e:
            return jsonify({'error': str(e)}), 404
            
    @bp.route('/history/items', methods=['GET'])
    def get_item_history():
        name = request.args.get('name')
        if not name:
            return jsonify({'error': 'Item name is required'}), 400
            
        try:
            history = item_use_cases.get_price_history(name)
            return jsonify(history), 200
        except ValueError as e:
            return jsonify({'error': str(e)}), 400

    return bp
