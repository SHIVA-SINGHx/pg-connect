import asyncio
import asyncpg

async def test():
    try:
        conn = await asyncpg.connect(
            'postgresql://postgres:Shehar%409910@db.hdxeckbjyfygwcanwyft.supabase.co:5432/postgres'
        )
        r = await conn.fetchval('SELECT version()')
        print("DB connected:", str(r)[:80])
        
        # Check tables
        tables = await conn.fetch("""
            SELECT tablename FROM pg_tables 
            WHERE schemaname = 'public' 
            ORDER BY tablename
        """)
        print("Tables:", [t['tablename'] for t in tables])
        await conn.close()
    except Exception as e:
        print("Error:", type(e).__name__, str(e)[:200])

asyncio.run(test())
