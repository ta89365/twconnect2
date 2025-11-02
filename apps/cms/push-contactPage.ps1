# ================== UTF-8 & Environment ==================
chcp 65001 > $null
[Console]::InputEncoding  = [System.Text.UTF8Encoding]::new()
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
$ProgressPreference = 'SilentlyContinue'
$ErrorActionPreference = 'Stop'

# ================== Sanity Access ==================
$PROJECT_ID = "ki3tylfo"
$DATASET    = "production"
$TOKEN      = "skl2JWnSK4fl50dOp9uzuMwjTxCVWzvXiJZtL8QBDnflbQ6730ZwZlqR76maQZNwuWxPRLFjAd5hVwpePvCW1IHIBPyLxez68SZGhgw7nr8g0XFFWsxk4yIGYnhtjLz3Y0X0HyMk4Wp9cwLZwllAm58j3BEaqFOez3gNnvNd9RaCTwKcZka6"   # ← 換成有效的 Data write token

$HEADERS    = @{ Authorization = "Bearer $TOKEN" }
$API_VER    = "v2021-06-07"
$MUTATE_API = "https://$PROJECT_ID.api.sanity.io/$API_VER/data/mutate/$DATASET"
$QUERY_API  = "https://$PROJECT_ID.api.sanity.io/$API_VER/data/query/$DATASET"
$ASSET_API  = "https://$PROJECT_ID.api.sanity.io/$API_VER/assets/images/$DATASET"

# ================== Helpers ==================
function NewKey() { [guid]::NewGuid().ToString("N") }
function PTSpan([string]$text){ @{ _type="span"; _key=(NewKey); text=$text; marks=@() } }
function PTBlock([string]$text, [string]$style="normal") {
  @{ _type="block"; _key=(NewKey); style=$style; markDefs=@(); children=@( PTSpan $text ) }
}
function PostJson($url, $payload) {
  try {
    $jsonText = if ($payload -is [string]) { $payload } else { ($payload | ConvertTo-Json -Depth 100 -Compress) }
    if ([string]::IsNullOrWhiteSpace($jsonText)) { throw "JSON payload is empty." }
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonText)
    return Invoke-RestMethod -Method Post -Uri $url -Headers $HEADERS `
      -ContentType 'application/json; charset=utf-8' -Body $bytes -ErrorAction Stop
  } catch {
    Write-Host "❌ HTTP Error calling $url" -ForegroundColor Red
    if ($_.Exception.Response -and $_.Exception.Response.GetResponseStream) {
      $sr = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
      Write-Host ($sr.ReadToEnd()) -ForegroundColor Yellow
    } else {
      Write-Host $_ -ForegroundColor Yellow
    }
    throw
  }
}
function UploadImage($filePath) {
  if (-not (Test-Path $filePath)) { throw "Image not found: $filePath" }
  # 直接上傳檔案，Sanity 會回傳 {document:{_id,...}}
  return Invoke-RestMethod -Method Post -Uri $ASSET_API -Headers $HEADERS `
    -ContentType "multipart/form-data" -InFile $filePath -ErrorAction Stop
}

# ================== Hero image source ==================
# 三選一：優先使用 HERO_ASSET_ID，其次用 HERO_IMAGE_PATH 上傳，最後自動抓第一張 imageAsset
$HERO_ASSET_ID   = ""            # 例如：image-abc123def456-1600x900-png
$HERO_IMAGE_PATH = ""            # 例如：C:\temp\hero.jpg  留空就不上傳

# ================== Build contactPage document ==================
# 固定 _id 方便覆蓋
$docId = "contactPage"

# — Hero section —
$heroTitle = @{ jp="資料請求・無料相談会のご予約"; zh="資料索取・免費諮詢預約"; en="Request Materials and Book a Free Consultation" }
$heroSubtitle = @{
  jp="台湾進出・クロスボーダー会計税務・ビザ/在留・M&A/IPO について、お気軽にご相談ください。"
  zh="台灣進出、跨境會計稅務、簽證與居留、M&A 與 IPO，歡迎透過 LINE 或表單與我們聯繫。"
  en="Feel free to reach out about Taiwan market entry, cross border accounting and tax, visas and residency, and M&A or IPO."
}
$ctas = @(
  @{ _type="contactCta"; kind="line";   href="https://line.me/R/..."; label=@{ jp="LINE 相談（推奨）"; zh="LINE 洽談（建議）"; en="Contact via LINE" }; recommended=$true },
  @{ _type="contactCta"; kind="email";  href="mailto:info@taiwanconnect.example"; label=@{ jp="メールで相談"; zh="用 Email 聯絡"; en="Contact via Email" } },
  @{ _type="contactCta"; kind="booking"; label=@{ jp="無料相談を予約する"; zh="預約免費諮詢"; en="Book a Free Consultation" } }
)

# — Info Bar —
$languages     = @{ jp="対応言語：日本語・中国語・英語"; zh="支援語言：日文、中文、英文"; en="Languages supported" }
$businessHours = @{ jp="受付時間：平日 10:00–17:00（日本時間）"; zh="服務時間：工作日 10:00–17:00（日本時間）"; en="Hours" }
$serviceAreas  = @{ jp="対応エリア：日本・台湾・米国（オンライン可）"; zh="服務地區：日本、台灣、 美國（可線上）"; en="Service Areas" }

# — Common topics (short list) —
$commonTopics = @{
  jp=@("会社設立・銀行口座開設","会計・税務（IFRS・US GAAP・国際税務）","ビザ・在留（経営管理・就労・家族帯同）","クロスボーダーM&A・IPO・PCAOB 対応","移住・生活実務支援")
  zh=@("公司設立與銀行開戶","會計與稅務 IFRS 與 US GAAP 與國際稅務","簽證與居留 經營管理 與就業 與家屬","跨境 M&A 與 IPO 與 PCAOB 應對","移居與生活實務支援")
  en=@("Entity setup and bank account","Accounting and tax IFRS and US GAAP and international tax","Visa and residency management employment family","Cross border M&A IPO PCAOB","Relocation and practical life support")
}

# — Form options —
$subjectOptions = @{
  jp=@("台湾進出（会社設立／口座／登記）","会計・税務（IFRS／US GAAP／国際税務）","ビザ／在留（経営管理／就労／家族）","M&A","IPO","PCAOB","海外移住サポート","その他")
  zh=@("台灣進出 公司設立 口座 登記","會計與稅務 IFRS US GAAP 國際稅務","簽證與居留 經營管理 就業 家屬","M&A","IPO","PCAOB","海外移居支援","其他")
  en=@("Taiwan entry setup banking registration","Accounting tax IFRS US GAAP international tax","Visa residency management employment family","M&A","IPO","PCAOB","Relocation support","Other")
}
$preferredContactOptions = @{ jp=@("LINE","メール","オンライン面談"); zh=@("LINE","Email","線上會議"); en=@("LINE","Email","Online meeting") }

$summaryHint   = @{ jp="ご相談概要は 300–600 字目安でご記入ください。"; zh="請以約 300 到 600 字描述需求重點。"; en="Please summarize in about 300 to 600 characters." }
$datetimeHint  = @{ jp="第1希望／第2希望（日時・タイムゾーン）をご記入ください。"; zh="請提供第一與第二備選時段與時區。"; en="Please provide first and second preferred times and your time zone." }
$attachmentHint= @{ jp="資料添付 PDF／Excel／画像（10MB まで）"; zh="可附上 PDF、Excel 或圖片 檔案上限 10MB"; en="You may attach PDF Excel or images up to 10MB" }

# — Consent & Success (localeBlock arrays of blocks) —
$consentText = @{
  jp=@( PTBlock "個人情報の取り扱いに同意します。当社は取得した情報を適切に管理し、第三者に提供しません。" )
  zh=@( PTBlock "我同意個人資料告知與使用說明。本公司將妥善管理您提供的資訊，不會提供予第三人。" )
  en=@( PTBlock "I agree to the handling of my personal information. We manage your data properly and do not share it with third parties." )
}
$submitSuccessMessage = @{
  jp=@( PTBlock "お問い合わせありがとうございます。2営業日以内に担当者よりご連絡いたします。お急ぎの方は LINE にてご連絡ください。" )
  zh=@( PTBlock "感謝您的聯繫。我們將在二個工作日內由專人回覆。如需加速處理歡迎透過 LINE 聯繫。" )
  en=@( PTBlock "Thank you for your inquiry. We will get back within two business days. For urgent cases please contact us via LINE." )
}
$autoReplySubject = @{ jp="お問い合わせありがとうございます（Taiwan Connect）"; zh="感謝您的聯繫 Taiwan Connect"; en="Thank you for contacting Taiwan Connect" }
$autoReplyBody = @{
  jp=@( PTBlock "この度はお問い合わせいただきありがとうございます。内容を確認のうえ 2 営業日以内に担当よりご連絡いたします。ご入力内容 抜粋 ご用件：{{subject}} 会社名：{{company}} ご氏名：{{name}} ご希望の連絡方法：{{preferredContact}} LINE 相談も可能です：{{lineLink}} Taiwan Connect Inc." )
  zh=@( PTBlock "感謝您的來信 我們將於二個工作日內聯繫您 您填寫的重點如下 主旨：{{subject}} 公司：{{company}} 姓名：{{name}} 首選聯絡方式：{{preferredContact}} 也可透過 LINE 聯繫：{{lineLink}} Taiwan Connect Inc." )
  en=@( PTBlock "Thank you for reaching out We will respond within two business days Summary Subject {{subject}} Company {{company}} Name {{name}} Preferred contact {{preferredContact}} You can also message us on LINE {{lineLink}} Taiwan Connect Inc." )
}

# — Addresses —
$addresses = @(
  @{ _type="contactAddress"; label=@{ jp="日本"; zh="日本"; en="Japan" };  address=@{ jp="東京都板橋区板橋三丁目9 14 503 グラスコート板橋"; zh="東京都板橋區板橋三丁目9 14 503 グラスコート板橋"; en="Itabashi 3-9-14-503, Tokyo" } },
  @{ _type="contactAddress"; label=@{ jp="台湾"; zh="台灣"; en="Taiwan" }; address=@{ jp="桃園市平鎮區新光路三段158巷18號"; zh="桃園市平鎮區新光路三段158巷18號"; en="No. 18, Ln. 158, Sec. 3, Xingguang Rd., Pingzhen, Taoyuan" } },
  @{ _type="contactAddress"; label=@{ jp="米国（準備中）"; zh="美國（準備中）"; en="United States" }; address=@{ jp="クロスボーダーサポート拠点（準備中）"; zh="跨境支援據點（準備中）"; en="Cross border support base coming soon" }; note=@{ jp="準備中"; zh="準備中"; en="Coming soon" } }
)

# ================== Resolve heroImage asset ==================
$heroAssetId = $HERO_ASSET_ID
if (-not [string]::IsNullOrWhiteSpace($HERO_IMAGE_PATH)) {
  $up = UploadImage $HERO_IMAGE_PATH
  $heroAssetId = $up.document._id
}
if ([string]::IsNullOrWhiteSpace($heroAssetId)) {
  $q = PostJson $QUERY_API (@{ query="*[_type=='sanity.imageAsset'][0]._id" })
  $heroAssetId = $q.result
}
if ([string]::IsNullOrWhiteSpace($heroAssetId)) {
  throw "Hero image is required by schema. Provide HERO_ASSET_ID or HERO_IMAGE_PATH, or upload at least one image to the project."
}
$heroImage = @{ _type="image"; asset=@{ _type="reference"; _ref=$heroAssetId }; alt=@{ jp=""; zh=""; en="" } }

# ================== Mutations (createOrReplace) ==================
$doc = @{
  _id   = $docId
  _type = "contactPage"

  heroTitle    = $heroTitle
  heroSubtitle = $heroSubtitle
  heroImage    = $heroImage
  ctas         = $ctas

  languages     = $languages
  businessHours = $businessHours
  serviceAreas  = $serviceAreas

  commonTopics            = $commonTopics
  subjectOptions          = $subjectOptions
  preferredContactOptions = $preferredContactOptions
  summaryHint             = $summaryHint
  datetimeHint            = $datetimeHint
  attachmentHint          = $attachmentHint
  consentText             = $consentText

  submitSuccessMessage = $submitSuccessMessage
  autoReplySubject     = $autoReplySubject
  autoReplyBody        = $autoReplyBody

  addresses = $addresses
}

$mut = @{ mutations = @(@{ createOrReplace = $doc }) }
$resp = PostJson $MUTATE_API $mut
Write-Host "✅ Transaction: $($resp.transactionId)" -ForegroundColor Green

# ================== Verify ==================
$verify = @{
  query  = "*[_id==$id][0]{ _id,_type, hero{ 'title': ^.heroTitle.jp }, 'ctasCount': count(ctas), 'addrCount': count(addresses) }"
  params = @{ id = $docId }
}
$result = PostJson $QUERY_API $verify
"🔎 Verify:"; ($result.result | ConvertTo-Json -Depth 10)
