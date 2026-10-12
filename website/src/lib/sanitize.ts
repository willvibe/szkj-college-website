// 富文本 HTML 服务端净化（防存储型 XSS）
// 用于新闻正文等经 dangerouslySetInnerHTML 渲染的内容：入库前白名单净化
import DOMPurify from "isomorphic-dompurify";

// 视频类 iframe 仅允许 https，阻止 javascript: / data: 协议
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.nodeName === "IFRAME") {
    const src = node.getAttribute("src") ?? "";
    if (src && !/^https:\/\//i.test(src)) node.removeAttribute("src");
    node.setAttribute("loading", "lazy");
  }
});

/** 净化富文本 HTML：白名单标签/属性，剥除脚本、事件属性、危险协议 */
export function sanitizeRichHtml(html: string): string {
  if (!html) return "";
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "hr", "div", "span", "h1", "h2", "h3", "h4", "h5", "h6",
      "strong", "b", "em", "i", "u", "s", "sub", "sup", "blockquote", "pre", "code",
      "ul", "ol", "li", "table", "thead", "tbody", "tr", "td", "th",
      "a", "img", "figure", "figcaption", "section", "article", "header", "footer", "main", "aside",
      "video", "audio", "source",
      "iframe", // 仅 https src（见 hook）
    ],
    ALLOWED_ATTR: [
      "href", "src", "alt", "title", "width", "height", "style", "class",
      "target", "rel", "colspan", "rowspan", "align", "valign", "bgcolor", "color",
      "controls", "poster", "preload", "allow", "allowfullscreen", "frameborder", "loading",
    ],
    ALLOW_DATA_ATTR: false,
  });
}
