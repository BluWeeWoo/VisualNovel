from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,PageBreak
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_LEFT
from pypdf import PdfReader
pdfmetrics.registerFont(TTFont('Body','C:/Windows/Fonts/calibri.ttf'))
pdfmetrics.registerFont(TTFont('Bold','C:/Windows/Fonts/calibrib.ttf'))
pdfmetrics.registerFont(TTFont('Title','C:/Windows/Fonts/georgia.ttf'))
styles={
'body':ParagraphStyle('body',fontName='Body',fontSize=11,leading=15,spaceAfter=8,textColor=HexColor('#293c49')),
'label':ParagraphStyle('label',fontName='Bold',fontSize=9,leading=12,spaceBefore=6,spaceAfter=3,keepWithNext=True,textColor=HexColor('#456c78')),
'direction':ParagraphStyle('direction',fontName='Body',fontSize=9,leading=12,spaceAfter=7,textColor=HexColor('#637168')),
'heading':ParagraphStyle('heading',fontName='Title',fontSize=22,leading=28,spaceAfter=15,textColor=HexColor('#283f63'),keepWithNext=True),
}
lines=Path('exports/Our Summer Unfinished - Editable Script.txt').read_text(encoding='utf-8-sig').splitlines()
flow=[]
for i,line in enumerate(lines):
 line=line.strip().replace('—','-').replace('–','-')
 if not line or line.startswith('===='):continue
 if line.startswith('SCENE:'):
  flow.append(PageBreak());flow.append(Paragraph(escape(line[7:]),styles['heading']));continue
 if i==0:style='heading'
 elif line.endswith(':') or line in ['ABOUT THIS FILE','READING NOTES','END OF CURRENT PLAYABLE OPENING']:style='label'
 elif line.startswith('[') or line.startswith('ID:') or line.startswith('GO TO:'):style='direction'
 else:style='body'
 flow.append(Paragraph(escape(line),styles[style]))

def page(c,doc):
 w,h=doc.pagesize
 c.setStrokeColor(HexColor('#baa486'));c.line(48,h-37,w-48,h-37)
 c.setFont('Body',8);c.setFillColor(HexColor('#637168'));c.drawString(48,h-29,'OUR SUMMER, UNFINISHED  /  OPENING SCRIPT')
 c.drawString(48,28,'Current playable opening - 23 September 2026');c.drawRightString(w-48,28,str(doc.page))
p='output/pdf/Our Summer Unfinished - Opening Script.pdf'
doc=SimpleDocTemplate(p,pagesize=(595.28,841.89),rightMargin=52,leftMargin=52,topMargin=55,bottomMargin=48,title='Our Summer, Unfinished - Opening Script',author='Our Summer, Unfinished')
doc.build(flow,onFirstPage=page,onLaterPages=page)
r=PdfReader(p);print('Pages:',len(r.pages));assert all(p.extract_text().strip() for p in r.pages)
text='\n'.join(p.extract_text() for p in r.pages)
assert 'Rowan' in text and '{name}?' in text
print('Verified text extraction and closing dialogue.')
