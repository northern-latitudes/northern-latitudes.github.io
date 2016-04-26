---
layout: null
permalink: /links.jsonp
---

{% assign orgs = site.data.orgs | sort %}
callback([
  {% for org in orgs %}
  {
    "text": "{{ org[1].name }}",
    "href": "{{ org[1].link }}"
  } {% unless forloop.last %}, {% endunless %}
  {% endfor %}
])
