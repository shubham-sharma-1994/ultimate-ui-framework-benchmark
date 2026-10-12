import json,subprocess,time
from concurrent.futures import ThreadPoolExecutor
S={k:v for k,v in json.load(open('sessions.json')).items() if not k.endswith('_old')}
def G(p):
    for _ in range(4):
        o=subprocess.run(["curl","-sS","--max-time","40","https://jules.googleapis.com/v1alpha/"+p],capture_output=True,text=True).stdout
        try: return json.loads(o)
        except Exception: time.sleep(2)
    return {}
def one(kv):
    k,i=kv
    s=G(f"sessions/{i}"); acts=sorted(G(f"sessions/{i}/activities?pageSize=100").get('activities',[]),key=lambda a:a['createTime'])
    if not s or not acts: return f"{k:13}api-error"
    prs=[o['pullRequest']['url'].rsplit('/',1)[1] for o in s.get('outputs',[]) if 'pullRequest' in o]
    plans=[a['planGenerated']['plan']['id'] for a in acts if 'planGenerated' in a]; ap=[a['planApproved']['planId'] for a in acts if 'planApproved' in a]
    pend=bool(plans) and plans[-1] not in ap
    lk=acts[-1]; kind=[x for x in lk if x not in('name','id','createTime','originator')][0]
    am=[a for a in acts if 'agentMessaged' in a]
    msg=am[-1]['agentMessaged']['agentMessage'][:300].replace('\n',' ') if am and s['state']=='AWAITING_USER_FEEDBACK' else ''
    return f"{k:13}{s['state']:22}pend={pend!s:5}PR#={prs[0] if prs else '-':3} last={kind}@{lk['createTime'][11:16]} {msg}"
with ThreadPoolExecutor(14) as ex:
    for r in ex.map(one,S.items()): print(r)
