import json
import os

log_path = r'C:\Users\fasya\.gemini\antigravity-cli\brain\6663d234-3970-4c0c-8598-78340db5c219\.system_generated\logs\transcript.jsonl'
output_path = r'D:\PersonalOS\tasks_backup.txt'

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        if 'id=\\"view-list\\"' in line or "id='view-list'" in line or 'view-list' in line:
            try:
                data = json.loads(line)
                if 'tool_calls' in data:
                    for call in data['tool_calls']:
                        args = call.get('tool_args', {})
                        content = args.get('CodeContent', args.get('ReplacementContent', ''))
                        if 'view-list' in str(args):
                            with open(output_path, 'w', encoding='utf-8') as fw:
                                fw.write(str(args))
                            print('Found and saved!')
                            exit()
            except Exception as e:
                pass
print('Not found')
