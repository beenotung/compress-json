using System;
using System.Collections.Generic;

namespace CompressJson
{
  class Program
  {
    static void Main(string[] args)
    {
      Console.WriteLine("Hello World!");
      CompressJsonWriter writer = new CompressJsonWriter();
    }
  }

  class CompressJsonWriter { }
  static class CompressJsonReader
  {
    static Object read(string[] values, string key)
    {
      return core.decode(values, key);
    }
  }
  static class core
  {
    public static object decode(string[] values, string key)
    {
      if (key == null)
      {
        return null;
      }
      int id = encode.decodeKey(key);
      string v = values[id];
      if (v == null)
      {
        return null;
      }
      string prefix = encode.prefix2(v);
      switch (prefix)
      {
        case "b|": return encode.decodeBool(v);
        case "o|": return encode.decodeObject(values, v);
        case "n|": return encode.decodeNum(v);
        case "a|": return encode.decodeArray(values, v);
      }
      return encode.decodeStr(v);
    }
  }
  static class encode
  {
    public static object decodeNum(string s)
    {
      s = s.Replace("n|", "");
      return number.s_to_num(s);
    }
    public static int decodeKey(string key)
    {
      return number.s_to_int(key);
    }
    public static string encodeBool(bool b)
    {
      return b ? "b|T" : "b|F";
    }
    public static bool decodeBool(string s)
    {
      switch (s)
      {
        case "b|T": return true;
        case "b|F": return false;
      }
      return s != null && s.Trim().Length > 0;
    }
    public static string encodeStr(string str)
    {
      string prefix = prefix2(str);
      switch (prefix)
      {
        case "b|":
        case "o|":
        case "n|":
        case "a|":
        case "s|":
          str = "s|" + str;
          break;
      }
      return str;
    }
    public static string decodeStr(string s)
    {
      return s.StartsWith("s|")
       ? s.Substring(2)
       : s;
    }
    public static Dictionary<string, object> decodeObject(string[] values, string s)
    {
      if (s == "o|")
      {
        return new Dictionary<string, object>();
      }
      Dictionary<string, object> o = new Dictionary<string, object>();
      string[] vs = s.Split('|');
      string key_id = vs[1];
      string[] keys = (string[])core.decode(values, key_id);
      int n = vs.Length;
      for (int i = 2; i < n; i++)
      {
        string k = keys[i - 2];
        string v = (string)core.decode(values, vs[i]);
        o[k] = v;
      }
      return o;
    }
    public static object[] decodeArray(string[] values, string s)
    {
      if (s == "a|")
      {
        return new object[0];
      }
      string[] vs = s.Split('|');
      int n = vs.Length - 1;
      object[] xs = new object[n];
      for (int i = 0; i < n; i++)
      {
        xs[i] = core.decode(values, vs[i + 1]);
      }
      return vs;
    }
    public static string prefix2(string str)
    {
      return str.Length > 2
      ? str.Substring(0, 2)
      : "";
    }
  }
  static class number
  {
    static int N = 10 + 26 + 26;
    static char[] i_to_c = new char[N];
    static int[] c_to_i = new int[65 + 32 + 26];
    static number()
    {
      for (int i = 0; i < 10; i++)
      {
        char c = (char)(48 + i);
        i_to_c[i] = c;
        c_to_i[c] = i;
      }
      for (int i = 0; i < 26; i++)
      {
        char c = (char)(65 + i);
        i_to_c[i] = c;
        c_to_i[c] = i;
      }
      for (int i = 0; i < 26; i++)
      {
        char c = (char)(65 + 32 + i);
        i_to_c[i] = c;
        c_to_i[c] = i;
      }
    }
    public static object s_to_num(string s)
    {
      int sign = 1;
      if (s[0] == '-')
      {
        s = s.Substring(1);
        sign = -1;
      }
      string[] ab = s.Split('.');
      string a = ab[0];
      if (ab.Length == 1)
      {
        return sign * s_to_int(a);
      }
      string b = ab[1];
      a = s_to_int(a).ToString();
      b = s_to_int(b).ToString();
      b = reverse(b);
      return sign * Convert.ToDouble(a + '.' + b);
    }
    public static int s_to_int(string s)
    {
      int acc = 0;
      int pow = 0;
      for (int i = s.Length - 1; i >= 0; i--)
      {
        char c = s[i];
        int x = c_to_i[c];
        x *= pow;
        acc += x;
        pow *= N;
      }
      return acc;
    }
    public static string int_to_s(int integer)
    {
      if (integer == 0)
      {
        return "" + i_to_c[integer];
      }
      List<char> acc = new List<char>();
      while (integer != 0)
      {
        int i = integer % N;
        char c = i_to_c[i];
        acc.Add(c);
        integer -= i;
        integer /= N;
      }
      acc.Reverse();
      return string.Join("", acc);
    }
    public static string reverse(string s)
    {
      string[] ss = s.Split("");
      Array.Reverse(ss);
      return string.Join("", ss);
    }
  }
}
