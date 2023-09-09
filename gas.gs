function doGet(e) {
  try {
    let url = `https://b.hatena.ne.jp/${e.parameter.user}/bookmark.rss`;
    // let url = `https://b.hatena.ne.jp/satory074/bookmark.rss`;
    let response = UrlFetchApp.fetch(url);
    let xml = response.getContentText();
    let document = XmlService.parse(xml);
    let root = document.getRootElement();
  
    let rssNs = XmlService.getNamespace('http://purl.org/rss/1.0/');
    let dcNs = XmlService.getNamespace('http://purl.org/dc/elements/1.1/');
    let contentNs = XmlService.getNamespace('http://purl.org/rss/1.0/modules/content/');
  
    let items = root.getChildren('item', rssNs);
    let output = [];
  
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      let title = item.getChild('title', rssNs).getText();
      let link = item.getChild('link', rssNs).getText();
      let creator = item.getChild('creator', dcNs).getText();
      let date = item.getChild('date', dcNs).getText();
      let encodedContent = item.getChild('encoded', contentNs)?.getText() || '';
    
      output.push({
        title: title,
        link: link,
        creator: creator,
        date: date,
        encodedContent: encodedContent
      });
    }

    console.log(output);
  
    return ContentService.createTextOutput(JSON.stringify(output))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // エラーログを出力
    console.error(error);
    // エラーメッセージをJSONとして返す
    return ContentService.createTextOutput(JSON.stringify({ error: 'An error occurred.' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
