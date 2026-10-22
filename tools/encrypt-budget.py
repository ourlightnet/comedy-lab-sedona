"""Encrypt the budget for site/budget.html.

The budget itself never goes in this repo. Keep budget.json somewhere private,
then run:  python3 tools/encrypt-budget.py budget.json "the-password"
It writes site/assets/budget.enc.json, which only the password can open.
"""
import base64, hashlib, json, os, sys
from Crypto.Cipher import AES

ITER = 250000
src, password = sys.argv[1], sys.argv[2]
data = json.dumps(json.load(open(src)), separators=(',', ':')).encode()
salt, iv = os.urandom(16), os.urandom(12)
key = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, ITER, 32)
ct, tag = AES.new(key, AES.MODE_GCM, nonce=iv).encrypt_and_digest(data)
b64 = lambda b: base64.b64encode(b).decode()
out = {'iter': ITER, 'salt': b64(salt), 'iv': b64(iv), 'data': b64(ct + tag)}
dst = os.path.join(os.path.dirname(__file__), '..', 'site', 'assets', 'budget.enc.json')
json.dump(out, open(dst, 'w'))
print('wrote', os.path.normpath(dst))
