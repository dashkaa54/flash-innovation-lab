import json
import os
import urllib.request
import urllib.error

def handler(event: dict, context) -> dict:
    """Проверка ссылки через Google Safe Browsing API"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    url = body.get('url', '').strip()

    if not url:
        return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'URL не указан'})}

    api_key = (os.environ.get('GOOGLE_SAFE_BROWSING_KEY') or '').strip()
    if not api_key or len(api_key) < 10:
        return {'statusCode': 503, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'API ключ не настроен', 'safe': None})}

    payload = json.dumps({
        'client': {'clientId': 'cybershield', 'clientVersion': '1.0'},
        'threatInfo': {
            'threatTypes': ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
            'platformTypes': ['ANY_PLATFORM'],
            'threatEntryTypes': ['URL'],
            'threatEntries': [{'url': url}]
        }
    }).encode('utf-8')

    req = urllib.request.Request(
        f'https://safebrowsing.googleapis.com/v4/threatMatches:find?key={api_key}',
        data=payload,
        headers={'Content-Type': 'application/json'},
        method='POST'
    )

    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        return {'statusCode': 503, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': f'Ошибка API: {e.code}', 'safe': None})}

    matches = data.get('matches', [])
    if matches:
        threat_type = matches[0].get('threatType', 'UNKNOWN')
        labels = {
            'MALWARE': 'Вредоносное ПО',
            'SOCIAL_ENGINEERING': 'Фишинг / социальная инженерия',
            'UNWANTED_SOFTWARE': 'Нежелательное ПО',
            'POTENTIALLY_HARMFUL_APPLICATION': 'Потенциально опасное приложение',
        }
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'safe': False, 'threat': labels.get(threat_type, threat_type)})
        }

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'safe': True})
    }
