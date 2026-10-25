import asyncio
import asyncpg

async def check_enums():
    conn = await asyncpg.connect(
        'postgresql://postgres:Shehar%409910@db.hdxeckbjyfygwcanwyft.supabase.co:5432/postgres'
    )
    
    # Check enum values for all relevant enums
    enums = await conn.fetch("""
        SELECT t.typname, e.enumlabel
        FROM pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        WHERE t.typname IN ('roomsharingtype', 'listingstatus', 'genderpreference', 'userrole', 'accountstatus', 'mediotype', 'availabilitystatus')
        ORDER BY t.typname, e.enumsortorder
    """)
    
    current_enum = None
    for e in enums:
        if e['typname'] != current_enum:
            current_enum = e['typname']
            print(f"\n{current_enum}:")
        print(f"  - {e['enumlabel']}")
    
    await conn.close()

asyncio.run(check_enums())
