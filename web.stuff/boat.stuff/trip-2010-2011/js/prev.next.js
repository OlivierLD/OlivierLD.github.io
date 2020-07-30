// previous and next page, with "prinatble version"
function prevNext(idx, top, lang) {
	let prev = lpad((idx - 1).toString(), '0', 2);
	let next = lpad((idx + 1).toString(), '0', 2);
	let curr = lpad(idx.toString(), '0', 2);
	if (lang === 'FR') {
		prev += "_fr";
		next += "_fr";
		curr += "_fr";
	}
	let prevNextTag = '    ';
	if (idx > 0) {
		prevNextTag += ('<a href="' + prev + '.html"><img src="prev-chap.png" title="' + (lang === 'FR' ? 'Chapitre pr&eacute;c&eacute;dent' : 'Previous Chapter') + '"></a>&nbsp;');
  }
	if (idx < 14) {
		prevNextTag += ('<a href="' + next + '.html"><img src="next-chap.png" title="' + (lang === 'FR' ? 'Chapitre suivant' : 'Next Chapter') + '"></a>&nbsp;');
  }

  document.writeln('<tr>');
  document.writeln('  <td>');
  document.writeln(prevNextTag);
  document.writeln('  </td>');
  if (top) {
    document.writeln('  <td valign="top" align="right">');
    document.writeln('    <small><a href="' + curr + '.html?print" target="print"><img src="print_17x15.gif" border="0"></a> &nbsp;' + (lang === 'FR' ? 'Version imprimable' : 'Printable Version') + '</small>');
    document.writeln('  </td>');
  }
  document.writeln('</tr>');
}

function lpad(str, pad, len) {
  let s = str;
  while (s.length < len) {
  	s = pad + s;
  }
  return s;
}
