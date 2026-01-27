export async function parseRequestBody(request) {
  const contentType = request.headers.get('content-type') || '';
  
  const parsers = [
    {
      test: (ct) => ct.includes('application/json'),
      parse: (req) => req.json()
    },
    {
      test: (ct) => ct.includes('multipart/form-data') || ct.includes('x-www-form-urlencoded'),
      parse: (req) => req.formData().then(fd => Object.fromEntries(fd))
    },
    {
      test: (ct) => ct.includes('text/'),
      parse: (req) => req.text()
    }
  ];


  const parser = parsers.find(p => p.test(contentType));
  
  if (parser) {
    return await parser.parse(request);
  }


  return await autoDetect(request);
}

async function autoDetect(request) {
  const tests = [
    (req) => req.clone().json(),
    (req) => req.clone().formData().then(fd => Object.fromEntries(fd)),
    (req) => req.text()
  ];

  for (const test of tests) {
    try {
      return await test(request);
    } catch {
      continue;
    }
  }
  
  throw new Error('Unable to parse request body');
}